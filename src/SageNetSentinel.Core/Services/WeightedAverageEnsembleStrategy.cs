using SageNetSentinel.Contracts;
using SageNetSentinel.Core.Abstractions;
using SageNetSentinel.Core.Configuration;

namespace SageNetSentinel.Core.Services;

public class WeightedAverageEnsembleStrategy : IEnsembleStrategy
{
    private readonly FalsePositiveReductionConfig _config;
    private readonly float _mlNetWeight;
    private readonly float _sageMakerWeight;

    public WeightedAverageEnsembleStrategy(FalsePositiveReductionConfig config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));

        var mlWeight = Math.Max(0f, _config.MLNetWeight);
        var smWeight = Math.Max(0f, _config.SageMakerWeight);
        var total = mlWeight + smWeight;
        if (total <= 0f)
        {
            _mlNetWeight = 0.5f;
            _sageMakerWeight = 0.5f;
        }
        else
        {
            _mlNetWeight = mlWeight / total;
            _sageMakerWeight = smWeight / total;
        }
    }

    public FraudPrediction CombinePredictions(List<FraudPrediction> predictions, TransactionData transaction)
    {
        if (predictions == null || predictions.Count == 0)
        {
            throw new ArgumentException("At least one prediction is required", nameof(predictions));
        }

        if (predictions.Count == 1)
        {
            return predictions[0];
        }

        var first = predictions[0];
        var second = predictions[1];
        var combinedProbability = (first.FraudProbability * _mlNetWeight) + (second.FraudProbability * _sageMakerWeight);
        var bothAgree = first.IsFraudulent == second.IsFraudulent;

        return new FraudPrediction
        {
            TenantId = transaction.TenantId,
            TransactionId = transaction.TransactionId,
            IsFraudulent = bothAgree ? combinedProbability >= _config.FraudThreshold : combinedProbability >= _config.DisagreementThreshold,
            FraudProbability = combinedProbability,
            ConfidenceScore = Math.Clamp(Math.Min(first.ConfidenceScore, second.ConfidenceScore), 0f, 1f),
            PredictionSource = "Ensemble",
            RiskFactors = first.RiskFactors.Union(second.RiskFactors).Distinct().ToList(),
            RecommendedAction = combinedProbability >= Math.Max(_config.FraudThreshold, _config.DisagreementThreshold)
                ? "Decline"
                : combinedProbability >= _config.FraudThreshold
                    ? "Review"
                    : "Approve",
            PredictionTimestamp = DateTime.UtcNow,
            FeatureImportance = new Dictionary<string, float>
            {
                ["MLNet_Probability"] = first.FraudProbability,
                ["SageMaker_Probability"] = second.FraudProbability
            }
        };
    }
}

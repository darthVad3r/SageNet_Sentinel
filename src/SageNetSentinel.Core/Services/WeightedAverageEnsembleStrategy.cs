using SageNetSentinel.Contracts;
using SageNetSentinel.Core.Abstractions;
using SageNetSentinel.Core.Configuration;

namespace SageNetSentinel.Core.Services;

public class WeightedAverageEnsembleStrategy : IEnsembleStrategy
{
    private readonly FalsePositiveReductionConfig _config;

    public WeightedAverageEnsembleStrategy(FalsePositiveReductionConfig config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
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
        var combinedProbability = (first.FraudProbability * _config.MLNetWeight) + (second.FraudProbability * _config.SageMakerWeight);
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
            RecommendedAction = combinedProbability >= 0.8f ? "Decline" : combinedProbability >= 0.5f ? "Review" : "Approve",
            PredictionTimestamp = DateTime.UtcNow,
            FeatureImportance = new Dictionary<string, float>
            {
                ["MLNet_Probability"] = first.FraudProbability,
                ["SageMaker_Probability"] = second.FraudProbability
            }
        };
    }
}

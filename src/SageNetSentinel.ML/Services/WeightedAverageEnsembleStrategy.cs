using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Abstractions;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Weighted average ensemble strategy for combining predictions
/// </summary>
public class WeightedAverageEnsembleStrategy : IEnsembleStrategy
{
    private readonly FalsePositiveReductionConfig _config;
    private readonly IRiskAnalyzer _riskAnalyzer;

    public WeightedAverageEnsembleStrategy(
        FalsePositiveReductionConfig config,
        IRiskAnalyzer riskAnalyzer)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _riskAnalyzer = riskAnalyzer ?? throw new ArgumentNullException(nameof(riskAnalyzer));
    }

    public FraudPrediction CombinePredictions(
        List<FraudPrediction> predictions,
        TransactionData transaction)
    {
        if (predictions == null || predictions.Count == 0)
            throw new ArgumentException("At least one prediction is required", nameof(predictions));

        if (predictions.Count == 1)
            return predictions[0];

        // For two predictions (ML.NET and SageMaker)
        var mlNetPred = predictions[0];
        var sageMakerPred = predictions[1];

        // Weighted average of probabilities
        var combinedProbability =
            (mlNetPred.FraudProbability * _config.MLNetWeight) +
            (sageMakerPred.FraudProbability * _config.SageMakerWeight);

        // Check agreement
        var bothAgree = mlNetPred.IsFraudulent == sageMakerPred.IsFraudulent;
        var probabilityDifference = Math.Abs(mlNetPred.FraudProbability - sageMakerPred.FraudProbability);

        // Calculate confidence based on agreement
        var confidenceScore = bothAgree && probabilityDifference < 0.2f
            ? Math.Min(mlNetPred.ConfidenceScore, sageMakerPred.ConfidenceScore) * 1.2f
            : Math.Min(mlNetPred.ConfidenceScore, sageMakerPred.ConfidenceScore) * 0.7f;

        // Conservative approach: require higher threshold when models disagree
        var isFraudulent = bothAgree
            ? combinedProbability >= _config.FraudThreshold
            : combinedProbability >= _config.DisagreementThreshold;

        // Combine risk factors
        var combinedRiskFactors = mlNetPred.RiskFactors
            .Union(sageMakerPred.RiskFactors)
            .Distinct()
            .ToList();

        return new FraudPrediction
        {
            TransactionId = transaction.TransactionId,
            IsFraudulent = isFraudulent,
            FraudProbability = combinedProbability,
            ConfidenceScore = Math.Min(confidenceScore, 1.0f),
            PredictionSource = "Ensemble",
            RiskFactors = combinedRiskFactors,
            RecommendedAction = DetermineAction(combinedProbability, confidenceScore, bothAgree),
            PredictionTimestamp = DateTime.UtcNow,
            FeatureImportance = new Dictionary<string, float>
            {
                { "MLNet_Probability", mlNetPred.FraudProbability },
                { "SageMaker_Probability", sageMakerPred.FraudProbability },
                { "Models_Agreement", bothAgree ? 1.0f : 0.0f },
                { "Probability_Difference", probabilityDifference }
            }
        };
    }

    private static string DetermineAction(float probability, float confidence, bool modelsAgree)
    {
        if (probability >= 0.8f && confidence >= 0.7f && modelsAgree)
            return "Decline";

        if (probability >= 0.5f && probability < 0.8f)
            return "Review";

        if (confidence < 0.5f && probability >= 0.4f)
            return "Review";

        return "Approve";
    }
}

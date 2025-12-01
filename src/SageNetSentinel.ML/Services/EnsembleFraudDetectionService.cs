using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Services;
using SageNetSentinel.SageMaker.Services;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Ensemble service that combines ML.NET and SageMaker predictions to reduce false positives
/// </summary>
public class EnsembleFraudDetectionService
{
    private readonly MLNetFraudDetectionService _mlNetService;
    private readonly SageMakerFraudDetectionService? _sageMakerService;
    private readonly FalsePositiveReductionConfig _config;

    public EnsembleFraudDetectionService(
        MLNetFraudDetectionService mlNetService,
        SageMakerFraudDetectionService? sageMakerService = null,
        FalsePositiveReductionConfig? config = null)
    {
        _mlNetService = mlNetService;
        _sageMakerService = sageMakerService;
        _config = config ?? new FalsePositiveReductionConfig();
    }

    /// <summary>
    /// Predict fraud using ensemble approach with false positive reduction
    /// </summary>
    public async Task<FraudPrediction> PredictWithEnsembleAsync(TransactionData transaction)
    {
        // Get predictions from both models
        var mlNetPrediction = _mlNetService.Predict(transaction);
        
        FraudPrediction? sageMakerPrediction = null;
        if (_sageMakerService != null)
        {
            try
            {
                sageMakerPrediction = await _sageMakerService.PredictAsync(transaction);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SageMaker prediction failed: {ex.Message}. Using ML.NET only.");
            }
        }

        // Apply ensemble logic
        var ensemblePrediction = sageMakerPrediction != null
            ? CombinePredictions(mlNetPrediction, sageMakerPrediction, transaction)
            : mlNetPrediction;

        // Apply rule-based overrides to reduce false positives
        ensemblePrediction = ApplyRuleBasedOverrides(ensemblePrediction, transaction);

        // Apply confidence thresholding
        ensemblePrediction = ApplyConfidenceThreshold(ensemblePrediction);

        return ensemblePrediction;
    }

    /// <summary>
    /// Combine predictions from ML.NET and SageMaker using weighted average
    /// </summary>
    private FraudPrediction CombinePredictions(
        FraudPrediction mlNetPred,
        FraudPrediction sageMakerPred,
        TransactionData transaction)
    {
        // Weighted average of probabilities
        var combinedProbability = 
            (mlNetPred.FraudProbability * _config.MLNetWeight) +
            (sageMakerPred.FraudProbability * _config.SageMakerWeight);

        // Require both models to agree for high-confidence fraud detection
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

        // Combine risk factors from both models
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

    /// <summary>
    /// Apply rule-based overrides to reduce false positives
    /// </summary>
    private FraudPrediction ApplyRuleBasedOverrides(
        FraudPrediction prediction,
        TransactionData transaction)
    {
        var overrideReasons = new List<string>();

        // Override 1: Known safe patterns - small amounts at familiar merchants
        if (transaction.Amount < _config.SmallTransactionThreshold &&
            !transaction.IsInternational &&
            !transaction.IsHighRiskMerchant &&
            transaction.TransactionCountLast24Hours <= 5)
        {
            if (prediction.FraudProbability < 0.7f) // Only override moderate risks
            {
                overrideReasons.Add("Small amount at familiar low-risk merchant");
                prediction.IsFraudulent = false;
                prediction.RecommendedAction = "Approve";
            }
        }

        // Override 2: Normal transaction patterns during business hours
        if (transaction.Timestamp.Hour >= 8 && transaction.Timestamp.Hour <= 20 &&
            transaction.Amount < 500 &&
            transaction.TransactionCountLast24Hours <= 10 &&
            !transaction.IsHighRiskMerchant)
        {
            if (prediction.FraudProbability < 0.6f)
            {
                overrideReasons.Add("Normal transaction during business hours");
                prediction.FraudProbability *= 0.8f; // Reduce probability
            }
        }

        // Override 3: Recurring merchant pattern (simulated - would need historical data)
        // This would check if user frequently shops at this merchant
        
        // Override 4: Flag for manual review if models are uncertain
        if (prediction.ConfidenceScore < _config.LowConfidenceThreshold &&
            prediction.FraudProbability >= 0.4f &&
            prediction.FraudProbability <= 0.7f)
        {
            overrideReasons.Add("Low confidence - recommend manual review");
            prediction.RecommendedAction = "Review";
        }

        // Override 5: High-value transactions always require review
        if (transaction.Amount >= _config.HighValueTransactionThreshold)
        {
            if (prediction.FraudProbability >= 0.3f)
            {
                overrideReasons.Add("High-value transaction requires review");
                prediction.RecommendedAction = "Review";
            }
        }

        // Add override reasons to risk factors
        if (overrideReasons.Any())
        {
            prediction.RiskFactors.AddRange(overrideReasons.Select(r => $"Override: {r}"));
        }

        return prediction;
    }

    /// <summary>
    /// Apply confidence threshold to adjust final prediction
    /// </summary>
    private FraudPrediction ApplyConfidenceThreshold(FraudPrediction prediction)
    {
        // If confidence is too low, escalate to manual review
        if (prediction.ConfidenceScore < _config.MinimumConfidenceForAutoDecision)
        {
            prediction.RecommendedAction = "Review";
            prediction.RiskFactors.Add("Low confidence score - manual review recommended");
        }

        // Very high confidence fraudulent transactions
        if (prediction.IsFraudulent && 
            prediction.FraudProbability >= 0.9f && 
            prediction.ConfidenceScore >= 0.8f)
        {
            prediction.RecommendedAction = "Decline";
            prediction.RiskFactors.Add("High confidence fraud detection");
        }

        return prediction;
    }

    /// <summary>
    /// Determine recommended action based on probability, confidence, and agreement
    /// </summary>
    private string DetermineAction(float probability, float confidence, bool modelsAgree)
    {
        // High probability and high confidence with agreement: Decline
        if (probability >= 0.8f && confidence >= 0.7f && modelsAgree)
            return "Decline";

        // Moderate probability or disagreement: Review
        if (probability >= 0.5f && probability < 0.8f)
            return "Review";

        // Low confidence even with moderate probability: Review
        if (confidence < 0.5f && probability >= 0.4f)
            return "Review";

        // Low probability: Approve
        return "Approve";
    }
}

/// <summary>
/// Configuration for false positive reduction
/// </summary>
public class FalsePositiveReductionConfig
{
    /// <summary>
    /// Weight for ML.NET predictions (default: 0.5)
    /// </summary>
    public float MLNetWeight { get; set; } = 0.5f;

    /// <summary>
    /// Weight for SageMaker predictions (default: 0.5)
    /// </summary>
    public float SageMakerWeight { get; set; } = 0.5f;

    /// <summary>
    /// Fraud threshold when models agree (default: 0.5)
    /// </summary>
    public float FraudThreshold { get; set; } = 0.5f;

    /// <summary>
    /// Higher threshold when models disagree to reduce false positives (default: 0.7)
    /// </summary>
    public float DisagreementThreshold { get; set; } = 0.7f;

    /// <summary>
    /// Small transaction threshold for safe patterns (default: $50)
    /// </summary>
    public decimal SmallTransactionThreshold { get; set; } = 50m;

    /// <summary>
    /// High-value transaction requiring review (default: $5000)
    /// </summary>
    public decimal HighValueTransactionThreshold { get; set; } = 5000m;

    /// <summary>
    /// Confidence threshold for triggering review (default: 0.3)
    /// </summary>
    public float LowConfidenceThreshold { get; set; } = 0.3f;

    /// <summary>
    /// Minimum confidence required for automatic decision (default: 0.4)
    /// </summary>
    public float MinimumConfidenceForAutoDecision { get; set; } = 0.4f;
}

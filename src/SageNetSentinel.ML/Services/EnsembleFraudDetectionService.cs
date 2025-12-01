using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Abstractions;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Ensemble service that combines multiple fraud detection models to reduce false positives
/// </summary>
public class EnsembleFraudDetectionService : IFraudDetectionService
{
    private readonly IEnumerable<IFraudDetectionService> _detectionServices;
    private readonly IEnsembleStrategy _ensembleStrategy;
    private readonly FalsePositiveReductionConfig _config;

    public string ServiceName => "Ensemble";

    public EnsembleFraudDetectionService(
        IEnumerable<IFraudDetectionService> detectionServices,
        IEnsembleStrategy ensembleStrategy,
        FalsePositiveReductionConfig config)
    {
        _detectionServices = detectionServices ?? throw new ArgumentNullException(nameof(detectionServices));
        _ensembleStrategy = ensembleStrategy ?? throw new ArgumentNullException(nameof(ensembleStrategy));
        _config = config ?? throw new ArgumentNullException(nameof(config));
    }

    /// <summary>
    /// Predict fraud using ensemble approach with false positive reduction
    /// </summary>
    public async Task<FraudPrediction> PredictAsync(TransactionData transaction)
    {
        // Get predictions from all available services
        var predictions = new List<FraudPrediction>();
        
        foreach (var service in _detectionServices)
        {
            try
            {
                var prediction = await service.PredictAsync(transaction);
                predictions.Add(prediction);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{service.ServiceName} prediction failed: {ex.Message}");
            }
        }

        if (predictions.Count == 0)
        {
            throw new InvalidOperationException("No prediction services available or all failed");
        }

        // Use single prediction if only one service succeeded
        if (predictions.Count == 1)
        {
            return ApplyRuleBasedOverrides(predictions[0], transaction);
        }

        // Apply ensemble strategy
        var ensemblePrediction = _ensembleStrategy.CombinePredictions(predictions, transaction);

        // Apply rule-based overrides to reduce false positives
        ensemblePrediction = ApplyRuleBasedOverrides(ensemblePrediction, transaction);

        return ensemblePrediction;
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

        // Override 3: Flag for manual review if models are uncertain
        if (prediction.ConfidenceScore < _config.LowConfidenceThreshold &&
            prediction.FraudProbability >= 0.4f &&
            prediction.FraudProbability <= 0.7f)
        {
            overrideReasons.Add("Low confidence - recommend manual review");
            prediction.RecommendedAction = ReviewAction;
        }

        // Override 4: High-value transactions always require review
        if (transaction.Amount >= _config.HighValueTransactionThreshold)
        {
            if (prediction.FraudProbability >= 0.3f)
            {
                overrideReasons.Add("High-value transaction requires review");
                prediction.RecommendedAction = ReviewAction;
            }
        }

        // Add override reasons to risk factors
        if (overrideReasons.Any())
        {
            prediction.RiskFactors.AddRange(overrideReasons.Select(r => $"Override: {r}"));
        }

        // If confidence is too low, escalate to manual review
        if (prediction.ConfidenceScore < _config.MinimumConfidenceForAutoDecision)
        {
            prediction.RecommendedAction = ReviewAction;
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

    private const string ReviewAction = "Review";
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

using SageNetSentinel.Contracts;
using SageNetSentinel.Contracts.Constants;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Service for applying rule-based overrides to reduce false positives
/// </summary>
public class RuleBasedOverrideService
{
    private readonly FalsePositiveReductionConfig _config;

    public RuleBasedOverrideService(FalsePositiveReductionConfig config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
    }

    /// <summary>
    /// Apply rule-based overrides to reduce false positives
    /// </summary>
    public FraudPrediction ApplyOverrides(FraudPrediction prediction, TransactionData transaction)
    {
        var overrideReasons = new List<string>();

        // Apply individual override rules
        prediction = ApplySmallTransactionOverride(prediction, transaction, overrideReasons);
        prediction = ApplyBusinessHoursOverride(prediction, transaction, overrideReasons);
        prediction = ApplyLowConfidenceOverride(prediction, transaction, overrideReasons);
        prediction = ApplyHighValueTransactionOverride(prediction, transaction, overrideReasons);
        prediction = ApplyFinalConfidenceCheck(prediction, overrideReasons);
        prediction = ApplyHighConfidenceFraudOverride(prediction, overrideReasons);

        // Add override reasons to risk factors
        if (overrideReasons.Any())
        {
            prediction.RiskFactors.AddRange(overrideReasons.Select(r => $"Override: {r}"));
        }

        return prediction;
    }

    private FraudPrediction ApplySmallTransactionOverride(
        FraudPrediction prediction, 
        TransactionData transaction, 
        List<string> overrideReasons)
    {
        if (transaction.Amount < _config.SmallTransactionThreshold &&
            !transaction.IsInternational &&
            !transaction.IsHighRiskMerchant &&
            transaction.TransactionCountLast24Hours <= FraudDetectionConstants.TimeConstants.SafeTransactionsPerDay)
        {
            if (prediction.FraudProbability < FraudDetectionConstants.Thresholds.StandardFraud)
            {
                overrideReasons.Add("Small amount at familiar low-risk merchant");
                prediction.IsFraudulent = false;
                prediction.RecommendedAction = FraudDetectionConstants.Actions.Approve;
            }
        }

        return prediction;
    }

    private static FraudPrediction ApplyBusinessHoursOverride(
        FraudPrediction prediction, 
        TransactionData transaction, 
        List<string> overrideReasons)
    {
        if (transaction.Timestamp.Hour >= FraudDetectionConstants.TimeConstants.BusinessHourStart && 
            transaction.Timestamp.Hour <= FraudDetectionConstants.TimeConstants.BusinessHourEnd &&
            transaction.Amount < FraudDetectionConstants.TransactionLimits.MediumTransaction &&
            transaction.TransactionCountLast24Hours <= FraudDetectionConstants.TimeConstants.MaxTransactionsPerDay &&
            !transaction.IsHighRiskMerchant)
        {
            if (prediction.FraudProbability < 0.6f)
            {
                overrideReasons.Add("Normal transaction during business hours");
                prediction.FraudProbability *= 0.8f;
            }
        }

        return prediction;
    }

    private FraudPrediction ApplyLowConfidenceOverride(
        FraudPrediction prediction, 
        TransactionData transaction, 
        List<string> overrideReasons)
    {
        if (prediction.ConfidenceScore < _config.LowConfidenceThreshold &&
            prediction.FraudProbability >= FraudDetectionConstants.Thresholds.ModerateRisk &&
            prediction.FraudProbability <= FraudDetectionConstants.Thresholds.StandardFraud)
        {
            overrideReasons.Add("Low confidence - recommend manual review");
            prediction.RecommendedAction = FraudDetectionConstants.Actions.Review;
        }

        return prediction;
    }

    private FraudPrediction ApplyHighValueTransactionOverride(
        FraudPrediction prediction, 
        TransactionData transaction, 
        List<string> overrideReasons)
    {
        if (transaction.Amount >= _config.HighValueTransactionThreshold)
        {
            if (prediction.FraudProbability >= FraudDetectionConstants.Thresholds.LowRisk)
            {
                overrideReasons.Add("High-value transaction requires review");
                prediction.RecommendedAction = FraudDetectionConstants.Actions.Review;
            }
        }

        return prediction;
    }

    private FraudPrediction ApplyFinalConfidenceCheck(
        FraudPrediction prediction, 
        List<string> overrideReasons)
    {
        if (prediction.ConfidenceScore < _config.MinimumConfidenceForAutoDecision)
        {
            prediction.RecommendedAction = FraudDetectionConstants.Actions.Review;
            prediction.RiskFactors.Add("Low confidence score - manual review recommended");
        }

        return prediction;
    }

    private static FraudPrediction ApplyHighConfidenceFraudOverride(
        FraudPrediction prediction, 
        List<string> overrideReasons)
    {
        if (prediction.IsFraudulent &&
            prediction.FraudProbability >= FraudDetectionConstants.Thresholds.HighConfidenceFraud &&
            prediction.ConfidenceScore >= FraudDetectionConstants.Thresholds.HighConfidence)
        {
            prediction.RecommendedAction = FraudDetectionConstants.Actions.Decline;
            prediction.RiskFactors.Add("High confidence fraud detection");
        }

        return prediction;
    }
}
using SageNetSentinel.Contracts.Constants;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Service for determining recommended actions based on fraud predictions
/// </summary>
public static class ActionRecommendationService
{
    /// <summary>
    /// Determine recommended action based on fraud probability
    /// </summary>
    public static string DetermineAction(float probability)
    {
        return probability switch
        {
            >= FraudDetectionConstants.Thresholds.StandardFraud => FraudDetectionConstants.Actions.Decline,
            >= FraudDetectionConstants.Thresholds.ReviewRequired => FraudDetectionConstants.Actions.Review,
            _ => FraudDetectionConstants.Actions.Approve
        };
    }

    /// <summary>
    /// Determine action for ensemble predictions with confidence consideration
    /// </summary>
    public static string DetermineEnsembleAction(float probability, float confidence, bool modelsAgree)
    {
        if (probability >= FraudDetectionConstants.Thresholds.StandardFraud && 
            confidence >= FraudDetectionConstants.Thresholds.HighConfidence && 
            modelsAgree)
            return FraudDetectionConstants.Actions.Decline;

        if (probability >= FraudDetectionConstants.Thresholds.ReviewRequired && 
            probability < FraudDetectionConstants.Thresholds.StandardFraud)
            return FraudDetectionConstants.Actions.Review;

        if (confidence < FraudDetectionConstants.Thresholds.MediumConfidence && 
            probability >= FraudDetectionConstants.Thresholds.ModerateRisk)
            return FraudDetectionConstants.Actions.Review;

        return FraudDetectionConstants.Actions.Approve;
    }
}
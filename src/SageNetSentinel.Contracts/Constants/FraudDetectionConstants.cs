namespace SageNetSentinel.Contracts.Constants;

/// <summary>
/// Constants used throughout the fraud detection system
/// </summary>
public static class FraudDetectionConstants
{
    /// <summary>
    /// Fraud probability thresholds
    /// </summary>
    public static class Thresholds
    {
        public const float HighConfidenceFraud = 0.9f;
        public const float StandardFraud = 0.8f;
        public const float ReviewRequired = 0.5f;
        public const float ModerateRisk = 0.4f;
        public const float LowRisk = 0.3f;
        
        public const float HighConfidence = 0.8f;
        public const float MediumConfidence = 0.5f;
        public const float LowConfidence = 0.3f;
        public const float MinimumConfidenceForAutoDecision = 0.4f;
    }

    /// <summary>
    /// Transaction amount limits
    /// </summary>
    public static class TransactionLimits
    {
        public const decimal SmallTransaction = 50m;
        public const decimal MediumTransaction = 500m;
        public const decimal HighValueTransaction = 5000m;
    }

    /// <summary>
    /// Time-based constants
    /// </summary>
    public static class TimeConstants
    {
        public const int BusinessHourStart = 8;
        public const int BusinessHourEnd = 20;
        public const int MaxTransactionsPerDay = 10;
        public const int SafeTransactionsPerDay = 5;
    }

    /// <summary>
    /// Recommended actions
    /// </summary>
    public static class Actions
    {
        public const string Approve = "Approve";
        public const string Review = "Review";
        public const string Decline = "Decline";
    }

    /// <summary>
    /// Model configuration defaults
    /// </summary>
    public static class ModelDefaults
    {
        public const float DefaultMLNetWeight = 0.5f;
        public const float DefaultSageMakerWeight = 0.5f;
        public const float DefaultFraudThreshold = 0.5f;
        public const float DefaultDisagreementThreshold = 0.7f;
        public const float ProbabilityAgreementThreshold = 0.2f;
        public const float ConfidenceBoostFactor = 1.2f;
        public const float ConfidencePenaltyFactor = 0.7f;
    }

    /// <summary>
    /// AWS SageMaker configuration
    /// </summary>
    public static class SageMaker
    {
        public const string DefaultXGBoostImageUri = "433757028032.dkr.ecr.us-west-2.amazonaws.com/xgboost:latest";
        public const int DefaultTrainingTimeoutSeconds = 3600;
        public const int DefaultStorageVolumeGB = 10;
    }
}
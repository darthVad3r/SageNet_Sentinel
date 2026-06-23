namespace SageNetSentinel.Core.Configuration;

public class FalsePositiveReductionConfig
{
    public float MLNetWeight { get; set; } = 0.5f;
    public float SageMakerWeight { get; set; } = 0.5f;
    public float FraudThreshold { get; set; } = 0.5f;
    public float DisagreementThreshold { get; set; } = 0.7f;
    public float SmallTransactionThreshold { get; set; } = 50f;
    public float HighValueTransactionThreshold { get; set; } = 5000f;
    public float LowConfidenceThreshold { get; set; } = 0.3f;
    public float MinimumConfidenceForAutoDecision { get; set; } = 0.4f;
}

namespace SageNetSentinel.Contracts;

/// <summary>
/// Request for fraud detection analysis
/// </summary>
public class FraudDetectionRequest
{
    public TransactionData Transaction { get; set; } = new();
    public bool UseEnsemble { get; set; } = true;
    public bool IncludeFeatureImportance { get; set; } = false;
}

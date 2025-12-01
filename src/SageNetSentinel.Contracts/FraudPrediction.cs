namespace SageNetSentinel.Contracts;

/// <summary>
/// Represents the fraud detection prediction result
/// </summary>
public class FraudPrediction
{
    public string TransactionId { get; set; } = string.Empty;
    public bool IsFraudulent { get; set; }
    public float FraudProbability { get; set; }
    public float ConfidenceScore { get; set; }
    public string PredictionSource { get; set; } = string.Empty; // MLNet, SageMaker, Ensemble
    public Dictionary<string, float> FeatureImportance { get; set; } = new();
    public List<string> RiskFactors { get; set; } = new();
    public string RecommendedAction { get; set; } = string.Empty; // Approve, Decline, Review
    public DateTime PredictionTimestamp { get; set; }
}

using Microsoft.ML.Data;

namespace SageNetSentinel.ML.Models;

/// <summary>
/// ML.NET prediction output model
/// </summary>
public class FraudPredictionOutput
{
    [ColumnName("PredictedLabel")]
    public bool IsFraud { get; set; }

    [ColumnName("Probability")]
    public float Probability { get; set; }

    [ColumnName("Score")]
    public float Score { get; set; }
}

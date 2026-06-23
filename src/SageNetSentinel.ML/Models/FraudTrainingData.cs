using Microsoft.ML.Data;

namespace SageNetSentinel.ML.Models;

/// <summary>
/// ML.NET training data model for fraud detection
/// </summary>
public class FraudTrainingData
{
    [LoadColumn(0)]
    public float Amount { get; set; }

    [LoadColumn(1)]
    public float TransactionCountLast24Hours { get; set; }

    [LoadColumn(2)]
    public float AmountSpentLast24Hours { get; set; }

    [LoadColumn(3)]
    public float TimeSinceLastTransaction { get; set; }

    [LoadColumn(4)]
    public float DistanceFromLastTransaction { get; set; }

    [LoadColumn(5)]
    public bool IsInternational { get; set; }

    [LoadColumn(6)]
    public bool IsHighRiskMerchant { get; set; }

    [LoadColumn(7)]
    public float HourOfDay { get; set; }

    [LoadColumn(8)]
    public float DayOfWeek { get; set; }

    [LoadColumn(9)]
    [ColumnName("Label")]
    public bool IsFraud { get; set; }
}

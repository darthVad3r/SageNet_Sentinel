using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Models;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Service for converting between different data formats
/// </summary>
public static class TransactionDataConverter
{
    /// <summary>
    /// Convert TransactionData to FraudTrainingData format for ML.NET
    /// </summary>
    public static FraudTrainingData ToTrainingData(TransactionData transaction)
    {
        return new FraudTrainingData
        {
            Amount = (float)transaction.Amount,
            TransactionCountLast24Hours = transaction.TransactionCountLast24Hours,
            AmountSpentLast24Hours = (float)transaction.AmountSpentLast24Hours,
            TimeSinceLastTransaction = (float)(transaction.TimeSinceLastTransaction ?? 0),
            DistanceFromLastTransaction = (float)(transaction.DistanceFromLastTransaction ?? 0),
            IsInternational = transaction.IsInternational,
            IsHighRiskMerchant = transaction.IsHighRiskMerchant,
            HourOfDay = transaction.Timestamp.Hour,
            DayOfWeek = (float)transaction.Timestamp.DayOfWeek
        };
    }

    /// <summary>
    /// Format transaction data for SageMaker XGBoost (CSV format)
    /// </summary>
    public static string ToSageMakerCsv(TransactionData transaction)
    {
        return $"{transaction.Amount}," +
               $"{transaction.TransactionCountLast24Hours}," +
               $"{transaction.AmountSpentLast24Hours}," +
               $"{transaction.TimeSinceLastTransaction ?? 0}," +
               $"{transaction.DistanceFromLastTransaction ?? 0}," +
               $"{(transaction.IsInternational ? 1 : 0)}," +
               $"{(transaction.IsHighRiskMerchant ? 1 : 0)}," +
               $"{transaction.Timestamp.Hour}," +
               $"{(int)transaction.Timestamp.DayOfWeek}";
    }
}
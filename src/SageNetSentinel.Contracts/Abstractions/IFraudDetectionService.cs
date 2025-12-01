using SageNetSentinel.Contracts;

namespace SageNetSentinel.ML.Abstractions;

/// <summary>
/// Interface for fraud detection prediction services
/// </summary>
public interface IFraudDetectionService
{
    /// <summary>
    /// Predict fraud for a single transaction
    /// </summary>
    Task<FraudPrediction> PredictAsync(TransactionData transaction);
    
    /// <summary>
    /// Get the name/identifier of this prediction service
    /// </summary>
    string ServiceName { get; }
}

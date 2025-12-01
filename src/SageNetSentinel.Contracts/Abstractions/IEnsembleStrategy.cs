using SageNetSentinel.Contracts;

namespace SageNetSentinel.ML.Abstractions;

/// <summary>
/// Interface for fraud prediction ensemble strategies
/// </summary>
public interface IEnsembleStrategy
{
    /// <summary>
    /// Combine multiple predictions into a single prediction
    /// </summary>
    FraudPrediction CombinePredictions(
        List<FraudPrediction> predictions, 
        TransactionData transaction);
}

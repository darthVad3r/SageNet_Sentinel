using SageNetSentinel.Contracts;

namespace SageNetSentinel.Core.Abstractions;

public interface IFraudDetectionService
{
    Task<FraudPrediction> PredictAsync(TransactionData transaction);
    string ServiceName { get; }
}

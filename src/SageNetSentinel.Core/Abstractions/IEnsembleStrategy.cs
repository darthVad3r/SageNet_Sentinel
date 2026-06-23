using SageNetSentinel.Contracts;

namespace SageNetSentinel.Core.Abstractions;

public interface IEnsembleStrategy
{
    FraudPrediction CombinePredictions(List<FraudPrediction> predictions, TransactionData transaction);
}

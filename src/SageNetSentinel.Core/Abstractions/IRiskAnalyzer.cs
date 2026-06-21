using SageNetSentinel.Contracts;

namespace SageNetSentinel.Core.Abstractions;

public interface IRiskAnalyzer
{
    List<string> IdentifyRiskFactors(TransactionData transaction, float fraudProbability);
}

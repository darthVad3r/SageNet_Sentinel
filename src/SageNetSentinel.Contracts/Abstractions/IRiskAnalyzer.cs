using SageNetSentinel.Contracts;

namespace SageNetSentinel.ML.Abstractions;

/// <summary>
/// Interface for risk factor identification
/// </summary>
public interface IRiskAnalyzer
{
    /// <summary>
    /// Identify risk factors for a transaction
    /// </summary>
    List<string> IdentifyRiskFactors(TransactionData transaction, float fraudProbability);
}

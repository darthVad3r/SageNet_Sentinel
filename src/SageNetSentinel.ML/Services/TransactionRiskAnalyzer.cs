using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Abstractions;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Analyzes transactions to identify fraud risk factors
/// </summary>
public class TransactionRiskAnalyzer : IRiskAnalyzer
{
    public List<string> IdentifyRiskFactors(TransactionData transaction, float fraudProbability)
    {
        var factors = new List<string>();

        if (fraudProbability < 0.3f) return factors;

        if (transaction.Amount > 1000)
            factors.Add("High transaction amount");

        if (transaction.IsInternational)
            factors.Add("International transaction");

        if (transaction.IsHighRiskMerchant)
            factors.Add("High-risk merchant category");

        if (transaction.TransactionCountLast24Hours > 10)
            factors.Add("Unusual transaction frequency");

        if (transaction.DistanceFromLastTransaction > 500)
            factors.Add("Large distance from previous transaction");

        if (transaction.Timestamp.Hour < 6 || transaction.Timestamp.Hour > 23)
            factors.Add("Unusual transaction time");

        return factors;
    }
}

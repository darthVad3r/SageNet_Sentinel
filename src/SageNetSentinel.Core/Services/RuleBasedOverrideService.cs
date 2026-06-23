using SageNetSentinel.Contracts;
using SageNetSentinel.Contracts.Constants;
using SageNetSentinel.Core.Configuration;

namespace SageNetSentinel.Core.Services;

public class RuleBasedOverrideService
{
    private readonly FalsePositiveReductionConfig _config;

    public RuleBasedOverrideService(FalsePositiveReductionConfig config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
    }

    public FraudPrediction ApplyOverrides(FraudPrediction prediction, TransactionData transaction)
    {
        var overrideReasons = new List<string>();

        if (transaction.Amount < (decimal)_config.SmallTransactionThreshold
            && !transaction.IsInternational
            && !transaction.IsHighRiskMerchant
            && transaction.TransactionCountLast24Hours <= FraudDetectionConstants.TimeConstants.SafeTransactionsPerDay
            && prediction.FraudProbability < FraudDetectionConstants.Thresholds.StandardFraud)
        {
            overrideReasons.Add("Small amount at familiar low-risk merchant");
            prediction.IsFraudulent = false;
            prediction.RecommendedAction = FraudDetectionConstants.Actions.Approve;
        }

        if (prediction.ConfidenceScore < _config.MinimumConfidenceForAutoDecision)
        {
            prediction.RecommendedAction = FraudDetectionConstants.Actions.Review;
            prediction.RiskFactors.Add("Low confidence score - manual review recommended");
        }

        if (overrideReasons.Count > 0)
        {
            prediction.RiskFactors.AddRange(overrideReasons.Select(r => $"Override: {r}"));
        }

        return prediction;
    }
}

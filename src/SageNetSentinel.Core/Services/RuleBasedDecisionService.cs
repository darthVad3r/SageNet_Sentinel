using SageNetSentinel.Contracts;

namespace SageNetSentinel.Core.Services;

public class RuleBasedDecisionService
{
    public FraudPrediction ApplyBusinessRules(FraudPrediction prediction, TransactionData transaction)
    {
        // TODO(platform-team): Implement tenant-specific business rule policy engine integration.
        return prediction;
    }
}

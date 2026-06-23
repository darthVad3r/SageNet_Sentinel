using SageNetSentinel.Api.Models;

namespace SageNetSentinel.Api.Storage;

public class InMemoryFraudHistoryRepository : IFraudHistoryRepository
{
    public IReadOnlyCollection<FraudHistoryRecord> GetByTenant(string tenantId)
    {
        // TODO(platform-team): Replace in-memory placeholder with persistent fraud history store.
        return [new FraudHistoryRecord { TenantId = tenantId, TransactionId = "sample", IsFraudulent = false }];
    }
}

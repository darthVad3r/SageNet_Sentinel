using SageNetSentinel.Api.Models;

namespace SageNetSentinel.Api.Storage;

public class InMemoryAlertsRepository : IAlertsRepository
{
    public IReadOnlyCollection<FraudAlertRecord> GetByTenant(string tenantId)
    {
        // TODO(platform-team): Replace in-memory placeholder with alerting event store integration.
        return [new FraudAlertRecord { TenantId = tenantId, Message = "No active alerts" }];
    }
}

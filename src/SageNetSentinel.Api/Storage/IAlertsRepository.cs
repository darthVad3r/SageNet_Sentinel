using SageNetSentinel.Api.Models;

namespace SageNetSentinel.Api.Storage;

public interface IAlertsRepository
{
    IReadOnlyCollection<FraudAlertRecord> GetByTenant(string tenantId);
}

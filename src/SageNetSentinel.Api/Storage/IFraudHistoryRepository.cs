using SageNetSentinel.Api.Models;

namespace SageNetSentinel.Api.Storage;

public interface IFraudHistoryRepository
{
    IReadOnlyCollection<FraudHistoryRecord> GetByTenant(string tenantId);
}

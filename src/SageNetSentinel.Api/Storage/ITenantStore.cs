using SageNetSentinel.Api.Models;

namespace SageNetSentinel.Api.Storage;

public interface ITenantStore
{
    bool Register(TenantRegistrationRequest request);
    IReadOnlyCollection<string> GetTenantIds();
    TenantConfiguration? GetConfiguration(string tenantId);
}

using SageNetSentinel.Api.Models;

namespace SageNetSentinel.Api.Storage;

public class InMemoryTenantStore : ITenantStore
{
    private readonly Dictionary<string, TenantConfiguration> _tenants = new(StringComparer.OrdinalIgnoreCase);

    public bool Register(TenantRegistrationRequest request)
    {
        if (_tenants.ContainsKey(request.TenantId))
        {
            return false;
        }

        _tenants[request.TenantId] = new TenantConfiguration
        {
            TenantId = request.TenantId
        };

        return true;
    }

    public IReadOnlyCollection<string> GetTenantIds() => _tenants.Keys.ToList();

    public TenantConfiguration? GetConfiguration(string tenantId)
    {
        return _tenants.TryGetValue(tenantId, out var config) ? config : null;
    }
}

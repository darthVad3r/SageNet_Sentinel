namespace SageNetSentinel.Contracts;

/// <summary>
/// Represents tenant context for multi-tenant requests.
/// Populated from incoming request header X-Tenant-Id.
/// </summary>
public class TenantContext
{
    public const string HeaderName = "X-Tenant-Id";

    public string TenantId { get; set; } = "default";
}

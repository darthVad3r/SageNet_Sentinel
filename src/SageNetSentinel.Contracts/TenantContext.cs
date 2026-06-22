namespace SageNetSentinel.Contracts;

public interface ITenantContext
{
    string TenantId { get; }
}

/// <summary>
/// Represents tenant context for multi-tenant requests.
/// Populated from incoming request header X-Tenant-Id.
/// </summary>
public sealed class TenantContext : ITenantContext
{
    public const string HeaderName = "X-Tenant-Id";

    public string TenantId { get; init; } = "default";
}

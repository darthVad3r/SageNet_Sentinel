namespace SageNetSentinel.Contracts;

public interface ITenantContext
{
    string TenantId { get; }
}

public sealed class TenantContext : ITenantContext
{
    public required string TenantId { get; init; }
}

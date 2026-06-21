using Microsoft.Extensions.Logging;
using SageNetSentinel.Contracts;

namespace SageNetSentinel.Observability.Logging;

public static class TenantLoggingExtensions
{
    public static IDisposable BeginTenantScope(this ILogger logger, string tenantId)
    {
        return logger.BeginScope(new Dictionary<string, object?>
        {
            ["TenantId"] = tenantId
        }) ?? NullScope.Instance;
    }

    public static IDisposable BeginTenantScope(this ILogger logger, TransactionData transaction)
    {
        return logger.BeginTenantScope(transaction.TenantId);
    }

    private sealed class NullScope : IDisposable
    {
        public static readonly NullScope Instance = new();
        public void Dispose() { }
    }
}

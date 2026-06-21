using Microsoft.Extensions.Logging;
using SageNetSentinel.Contracts;

namespace SageNetSentinel.Observability.Logging;

public static class TenantLoggingExtensions
{
    public static IDisposable BeginTenantScope(this ILogger logger, string tenantId)
    {
        return logger.BeginScope(new Dictionary<string, object?>
        {
            ["TenantId"] = SanitizeForLog(tenantId)
        }) ?? NullScope.Instance;
    }

    public static IDisposable BeginTenantScope(this ILogger logger, TransactionData transaction)
    {
        return logger.BeginTenantScope(transaction.TenantId);
    }


    private static string SanitizeForLog(string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return string.Empty;
        }

        var sanitized = new string(value.Where(c => !char.IsControl(c)).ToArray());
        return sanitized.Length <= 128 ? sanitized : sanitized[..128];
    }

    private sealed class NullScope : IDisposable
    {
        public static readonly NullScope Instance = new();
        public void Dispose() { }
    }
}

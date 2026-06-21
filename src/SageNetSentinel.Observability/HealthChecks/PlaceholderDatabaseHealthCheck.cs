using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace SageNetSentinel.Observability.HealthChecks;

public class PlaceholderDatabaseHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        // TODO(platform-team): Replace with real database connectivity checks.
        return Task.FromResult(HealthCheckResult.Healthy("Database check placeholder configured"));
    }
}

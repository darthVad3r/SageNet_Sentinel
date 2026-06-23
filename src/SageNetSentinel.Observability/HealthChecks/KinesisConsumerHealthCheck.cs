using Microsoft.Extensions.Diagnostics.HealthChecks;
using SageNetSentinel.Kinesis.Services;

namespace SageNetSentinel.Observability.HealthChecks;

public class KinesisConsumerHealthCheck : IHealthCheck
{
    private readonly IKinesisConsumerHealth _consumerHealth;

    public KinesisConsumerHealthCheck(IKinesisConsumerHealth consumerHealth)
    {
        _consumerHealth = consumerHealth;
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_consumerHealth.IsHealthy
            ? HealthCheckResult.Healthy(_consumerHealth.StatusMessage)
            : HealthCheckResult.Unhealthy(_consumerHealth.StatusMessage));
    }
}

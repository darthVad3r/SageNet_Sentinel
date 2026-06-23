using Microsoft.Extensions.Diagnostics.HealthChecks;
using SageNetSentinel.Core.Abstractions;

namespace SageNetSentinel.Observability.HealthChecks;

public class ModelAvailabilityHealthCheck : IHealthCheck
{
    private readonly IModelTrainer _modelTrainer;

    public ModelAvailabilityHealthCheck(IModelTrainer modelTrainer)
    {
        _modelTrainer = modelTrainer;
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_modelTrainer.IsModelLoaded
            ? HealthCheckResult.Healthy("ML model is loaded")
            : HealthCheckResult.Degraded("ML model is not loaded yet"));
    }
}

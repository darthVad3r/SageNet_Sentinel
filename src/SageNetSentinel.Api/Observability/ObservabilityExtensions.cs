using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SageNetSentinel.Api.Observability;

public static class ObservabilityExtensions
{
    /// <summary>
    /// Placeholder observability registration. Replace with OpenTelemetry integration
    /// and exporters when platform configuration is available.
    /// </summary>
    public static IServiceCollection AddObservability(this IServiceCollection services, IConfiguration configuration)
    {
        // TODO: Add OpenTelemetry tracing + metrics instrumentation and configure exporters
        // e.g., AddOpenTelemetryTracing, AddAspNetCoreInstrumentation, configure OTLP/Jaeger/Prometheus
        return services;
    }
}

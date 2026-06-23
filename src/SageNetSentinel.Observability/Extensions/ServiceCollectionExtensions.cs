using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

namespace SageNetSentinel.Observability.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSageNetObservability(this IServiceCollection services)
    {
        services.AddOpenTelemetry()
            .WithTracing(builder =>
            {
                builder.AddAspNetCoreInstrumentation();
                builder.AddHttpClientInstrumentation();
                // TODO(platform-team): Add OTLP/Jaeger exporter wiring per environment.
            })
            .WithMetrics(builder =>
            {
                builder.AddAspNetCoreInstrumentation();
                builder.AddRuntimeInstrumentation();
                // TODO(platform-team): Add Prometheus/OTLP metrics exporter configuration.
            });

        return services;
    }
}

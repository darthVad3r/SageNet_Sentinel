using Amazon.Kinesis;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SageNetSentinel.Kinesis.Services;
using SageNetSentinel.ML.Abstractions;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((ctx, services) =>
    {
        // TODO: Configure AWS credentials and region via configuration/environment in production
        services.AddSingleton<IAmazonKinesis, AmazonKinesisClient>();

        // Register existing detection service implementations (ML ensemble expected)
        services.AddSingleton<IFraudDetectionService, SageNetSentinel.ML.Services.EnsembleFraudDetectionService>();

        services.AddHostedService<KinesisConsumerService>();
    })
    .Build();

await host.RunAsync();

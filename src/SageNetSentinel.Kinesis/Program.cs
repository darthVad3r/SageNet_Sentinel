using Amazon.Kinesis;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SageNetSentinel.Kinesis.Services;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((ctx, services) =>
    {
        // TODO: Configure AWS credentials and region via configuration/environment in production
        services.AddSingleton<IAmazonKinesis, AmazonKinesisClient>();

        // NOTE: IFraudDetectionService is expected to be registered by the hosting application.

        services.AddHostedService<KinesisConsumerService>();
    })
    .Build();

await host.RunAsync();

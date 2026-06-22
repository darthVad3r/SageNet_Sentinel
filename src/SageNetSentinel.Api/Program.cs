using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.ML;
using SageNetSentinel.Api.Storage;
using SageNetSentinel.Core.Abstractions;
using SageNetSentinel.Core.Configuration;
using SageNetSentinel.Core.Services;
using SageNetSentinel.Grpc.Services;
using SageNetSentinel.Kinesis.Configuration;
using SageNetSentinel.Kinesis.Services;
using SageNetSentinel.Kinesis.Workers;
using SageNetSentinel.ML.Infrastructure;
using SageNetSentinel.ML.Services;
using SageNetSentinel.Observability.Extensions;
using SageNetSentinel.Observability.HealthChecks;
using SageNetSentinel.Observability.Middleware;
using SageNetSentinel.SageMaker.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddGrpc();
builder.Services.AddSageNetObservability();

builder.Services.AddSingleton<FalsePositiveReductionConfig>(sp =>
{
    return new FalsePositiveReductionConfig
    {
        MLNetWeight = builder.Configuration.GetValue<float>("FalsePositiveReduction:MLNetWeight", 0.5f),
        SageMakerWeight = builder.Configuration.GetValue<float>("FalsePositiveReduction:SageMakerWeight", 0.5f),
        FraudThreshold = builder.Configuration.GetValue<float>("FalsePositiveReduction:FraudThreshold", 0.5f),
        DisagreementThreshold = builder.Configuration.GetValue<float>("FalsePositiveReduction:DisagreementThreshold", 0.7f),
        SmallTransactionThreshold = builder.Configuration.GetValue<float>("FalsePositiveReduction:SmallTransactionThreshold", 50f),
        HighValueTransactionThreshold = builder.Configuration.GetValue<float>("FalsePositiveReduction:HighValueTransactionThreshold", 5000f),
        LowConfidenceThreshold = builder.Configuration.GetValue<float>("FalsePositiveReduction:LowConfidenceThreshold", 0.3f),
        MinimumConfidenceForAutoDecision = builder.Configuration.GetValue<float>("FalsePositiveReduction:MinimumConfidenceForAutoDecision", 0.4f)
    };
});

builder.Services.AddSingleton<IRiskAnalyzer, TransactionRiskAnalyzer>();
builder.Services.AddSingleton<IEnsembleStrategy, WeightedAverageEnsembleStrategy>();

var mlModelPath = builder.Configuration["MLNet:ModelPath"] ?? "fraud_model.zip";
builder.Services.AddSingleton<MLContext>(_ => new MLContext(seed: 42));
builder.Services.AddSingleton<IModelRepository>(sp =>
{
    var mlContext = sp.GetRequiredService<MLContext>();
    return new FileModelRepository(mlContext, mlModelPath);
});

builder.Services.AddSingleton<MLNetFraudDetectionService>();
builder.Services.AddSingleton<IModelTrainer>(sp => sp.GetRequiredService<MLNetFraudDetectionService>());
builder.Services.AddSingleton<IFraudDetectionService>(sp => sp.GetRequiredService<MLNetFraudDetectionService>());

var useSageMaker = builder.Configuration.GetValue<bool>("SageMaker:Enabled");
if (useSageMaker)
{
    var endpointName = builder.Configuration["SageMaker:EndpointName"] ?? string.Empty;
    var roleArn = builder.Configuration["SageMaker:RoleArn"] ?? string.Empty;
    var s3Bucket = builder.Configuration["SageMaker:S3BucketName"] ?? string.Empty;
    var awsRegion = builder.Configuration["SageMaker:AwsRegion"];

    if (!string.IsNullOrEmpty(endpointName) && !string.IsNullOrEmpty(roleArn))
    {
        builder.Services.AddSingleton<SageMakerFraudDetectionService>(sp =>
        {
            var riskAnalyzer = sp.GetRequiredService<IRiskAnalyzer>();
            return new SageMakerFraudDetectionService(endpointName, roleArn, s3Bucket, riskAnalyzer, awsRegion);
        });
    }
}

builder.Services.AddSingleton<EnsembleFraudDetectionService>();

var kinesisSettings = builder.Configuration.GetSection("Kinesis").Get<KinesisSettings>() ?? new KinesisSettings();
builder.Services.AddSingleton(kinesisSettings);
builder.Services.AddSingleton<KinesisConsumerHealth>();
builder.Services.AddSingleton<IKinesisConsumerHealth>(sp => sp.GetRequiredService<KinesisConsumerHealth>());
builder.Services.AddSingleton<IKinesisTransactionConsumer, KinesisTransactionConsumer>();
builder.Services.AddHostedService<KinesisScoringWorker>();
// TODO(platform-team): Replace placeholder Kinesis consumer with IAM-backed stream client and deployment wiring.

builder.Services.AddSingleton<IModelMetadataStore, InMemoryModelMetadataStore>();
builder.Services.AddSingleton<ITenantStore, InMemoryTenantStore>();
builder.Services.AddSingleton<IFraudHistoryRepository, InMemoryFraudHistoryRepository>();
builder.Services.AddSingleton<IAlertsRepository, InMemoryAlertsRepository>();

builder.Services.AddHealthChecks()
    .AddCheck<ModelAvailabilityHealthCheck>("model-availability", tags: ["ready"])
    .AddCheck<KinesisConsumerHealthCheck>("kinesis-consumer", tags: ["ready"])
    .AddCheck<PlaceholderDatabaseHealthCheck>("database", tags: ["ready"]);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();

app.MapControllers();
app.MapGrpcService<FraudScoringGrpcService>();
// TODO(platform-team): Configure secure gRPC channels (mTLS, cert rotation, cipher policy).
app.MapHealthChecks("/health", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks("/ready", new HealthCheckOptions { Predicate = check => check.Tags.Contains("ready") });

app.Logger.LogInformation("SageNetSentinel API host started with REST, gRPC, and observability scaffolding");
app.Run();

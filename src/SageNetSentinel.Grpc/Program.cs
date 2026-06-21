using SageNetSentinel.ML.Abstractions;
using SageNetSentinel.Grpc.Services;

var builder = WebApplication.CreateBuilder(args);

// gRPC service - minimal host
builder.Services.AddGrpc();

// Reference existing detection services via DI
// NOTE: This project expects an IFraudDetectionService implementation to be registered by the host or added here.
builder.Services.AddSingleton<IFraudDetectionService, SageNetSentinel.ML.Services.EnsembleFraudDetectionService>();

builder.Services.AddLogging();

var app = builder.Build();

// TODO: Configure mTLS here using platform-provided certificates. Disabled by default per constraints.

app.MapGrpcService<ScoringGrpcService>();
app.MapGet("/", () => "SageNet Sentinel gRPC service (scoring)");

app.Run();

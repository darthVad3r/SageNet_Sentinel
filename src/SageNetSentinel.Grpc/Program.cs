using SageNetSentinel.Grpc.Services;

var builder = WebApplication.CreateBuilder(args);

// gRPC service - minimal host
builder.Services.AddGrpc();

// NOTE: IFraudDetectionService is expected to be registered by the hosting application.

builder.Services.AddLogging();

var app = builder.Build();

// TODO: Configure mTLS here using platform-provided certificates. Disabled by default per constraints.

app.MapGrpcService<FraudScoringGrpcService>();
app.MapGet("/", () => "SageNet Sentinel gRPC service (scoring)");

app.Run();

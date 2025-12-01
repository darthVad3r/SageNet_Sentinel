using SageNetSentinel.ML.Services;
using SageNetSentinel.SageMaker.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "SageNetSentinel Fraud Detection API", 
        Version = "v1",
        Description = "ML.NET and AWS SageMaker powered fraud detection system with false positive reduction"
    });
});

// Configure ML.NET service
var mlModelPath = builder.Configuration["MLNet:ModelPath"] ?? "fraud_model.zip";
builder.Services.AddSingleton(new MLNetFraudDetectionService(mlModelPath));

// Configure AWS SageMaker service (optional)
var useSageMaker = builder.Configuration.GetValue<bool>("SageMaker:Enabled");
if (useSageMaker)
{
    var endpointName = builder.Configuration["SageMaker:EndpointName"] ?? string.Empty;
    var roleArn = builder.Configuration["SageMaker:RoleArn"] ?? string.Empty;
    var s3Bucket = builder.Configuration["SageMaker:S3BucketName"] ?? string.Empty;
    var awsRegion = builder.Configuration["SageMaker:AwsRegion"];

    if (!string.IsNullOrEmpty(endpointName) && !string.IsNullOrEmpty(roleArn))
    {
        builder.Services.AddSingleton(new SageMakerFraudDetectionService(
            endpointName, roleArn, s3Bucket, awsRegion));
    }
}

// Configure False Positive Reduction
var fpConfig = new FalsePositiveReductionConfig
{
    MLNetWeight = builder.Configuration.GetValue<float>("FalsePositiveReduction:MLNetWeight", 0.5f),
    SageMakerWeight = builder.Configuration.GetValue<float>("FalsePositiveReduction:SageMakerWeight", 0.5f),
    FraudThreshold = builder.Configuration.GetValue<float>("FalsePositiveReduction:FraudThreshold", 0.5f),
    DisagreementThreshold = builder.Configuration.GetValue<float>("FalsePositiveReduction:DisagreementThreshold", 0.7f)
};

// Register Ensemble service
builder.Services.AddSingleton(sp =>
{
    var mlNetService = sp.GetRequiredService<MLNetFraudDetectionService>();
    var sageMakerService = sp.GetService<SageMakerFraudDetectionService>();
    return new EnsembleFraudDetectionService(mlNetService, sageMakerService, fpConfig);
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SageNetSentinel v1"));
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Logger.LogInformation("SageNetSentinel Fraud Detection API started successfully");

app.Run();

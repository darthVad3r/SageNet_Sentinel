using Amazon.SageMaker;
using Amazon.SageMaker.Model;
using Amazon.SageMakerRuntime;
using Amazon.SageMakerRuntime.Model;
using SageNetSentinel.Contracts;
using System.Text;
using System.Text.Json;

namespace SageNetSentinel.SageMaker.Services;

/// <summary>
/// Service for AWS SageMaker integration for fraud detection
/// </summary>
public class SageMakerFraudDetectionService
{
    private readonly IAmazonSageMaker _sageMakerClient;
    private readonly IAmazonSageMakerRuntime _sageMakerRuntime;
    private readonly string _endpointName;
    private readonly string _roleArn;
    private readonly string _s3BucketName;

    public SageMakerFraudDetectionService(
        string endpointName,
        string roleArn,
        string s3BucketName,
        string? awsRegion = null)
    {
        _endpointName = endpointName;
        _roleArn = roleArn;
        _s3BucketName = s3BucketName;

        if (!string.IsNullOrEmpty(awsRegion))
        {
            var config = new AmazonSageMakerConfig { RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(awsRegion) };
            var runtimeConfig = new AmazonSageMakerRuntimeConfig { RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(awsRegion) };
            
            _sageMakerClient = new AmazonSageMakerClient(config);
            _sageMakerRuntime = new AmazonSageMakerRuntimeClient(runtimeConfig);
        }
        else
        {
            _sageMakerClient = new AmazonSageMakerClient();
            _sageMakerRuntime = new AmazonSageMakerRuntimeClient();
        }
    }

    /// <summary>
    /// Create a training job in SageMaker using XGBoost for fraud detection
    /// </summary>
    public async Task<string> CreateTrainingJobAsync(
        string jobName,
        string trainingDataS3Uri,
        string outputS3Uri)
    {
        var request = new CreateTrainingJobRequest
        {
            TrainingJobName = jobName,
            RoleArn = _roleArn,
            AlgorithmSpecification = new AlgorithmSpecification
            {
                TrainingImage = GetXGBoostImageUri(),
                TrainingInputMode = TrainingInputMode.File
            },
            InputDataConfig = new List<Channel>
            {
                new Channel
                {
                    ChannelName = "train",
                    DataSource = new DataSource
                    {
                        S3DataSource = new S3DataSource
                        {
                            S3DataType = S3DataType.S3Prefix,
                            S3Uri = trainingDataS3Uri,
                            S3DataDistributionType = S3DataDistribution.FullyReplicated
                        }
                    },
                    ContentType = "text/csv",
                    CompressionType = CompressionType.None
                }
            },
            OutputDataConfig = new OutputDataConfig
            {
                S3OutputPath = outputS3Uri
            },
            ResourceConfig = new ResourceConfig
            {
                InstanceType = TrainingInstanceType.MlM5Xlarge,
                InstanceCount = 1,
                VolumeSizeInGB = 10
            },
            StoppingCondition = new StoppingCondition
            {
                MaxRuntimeInSeconds = 3600
            },
            HyperParameters = new Dictionary<string, string>
            {
                { "objective", "binary:logistic" },
                { "num_round", "100" },
                { "max_depth", "5" },
                { "eta", "0.2" },
                { "subsample", "0.8" },
                { "colsample_bytree", "0.8" },
                { "scale_pos_weight", "2" } // Help balance fraud/non-fraud classes
            }
        };

        var response = await _sageMakerClient.CreateTrainingJobAsync(request);
        Console.WriteLine($"Training job created: {jobName}");
        return response.TrainingJobArn;
    }

    /// <summary>
    /// Get the status of a training job
    /// </summary>
    public async Task<TrainingJobStatus> GetTrainingJobStatusAsync(string jobName)
    {
        var request = new DescribeTrainingJobRequest
        {
            TrainingJobName = jobName
        };

        var response = await _sageMakerClient.DescribeTrainingJobAsync(request);
        return response.TrainingJobStatus;
    }

    /// <summary>
    /// Create a model from a trained training job
    /// </summary>
    public async Task<string> CreateModelAsync(string modelName, string modelDataS3Uri)
    {
        var request = new CreateModelRequest
        {
            ModelName = modelName,
            ExecutionRoleArn = _roleArn,
            PrimaryContainer = new ContainerDefinition
            {
                Image = GetXGBoostImageUri(),
                ModelDataUrl = modelDataS3Uri
            }
        };

        var response = await _sageMakerClient.CreateModelAsync(request);
        Console.WriteLine($"Model created: {modelName}");
        return response.ModelArn;
    }

    /// <summary>
    /// Create an endpoint configuration
    /// </summary>
    public async Task<string> CreateEndpointConfigAsync(string configName, string modelName)
    {
        var request = new CreateEndpointConfigRequest
        {
            EndpointConfigName = configName,
            ProductionVariants = new List<ProductionVariant>
            {
                new ProductionVariant
                {
                    VariantName = "AllTraffic",
                    ModelName = modelName,
                    InitialInstanceCount = 1,
                    InstanceType = ProductionVariantInstanceType.MlM5Large
                }
            }
        };

        var response = await _sageMakerClient.CreateEndpointConfigAsync(request);
        Console.WriteLine($"Endpoint config created: {configName}");
        return response.EndpointConfigArn;
    }

    /// <summary>
    /// Create or update an endpoint
    /// </summary>
    public async Task<string> CreateOrUpdateEndpointAsync(string endpointConfigName)
    {
        try
        {
            // Check if endpoint exists
            var describeRequest = new DescribeEndpointRequest { EndpointName = _endpointName };
            var describeResponse = await _sageMakerClient.DescribeEndpointAsync(describeRequest);

            // Update existing endpoint
            var updateRequest = new UpdateEndpointRequest
            {
                EndpointName = _endpointName,
                EndpointConfigName = endpointConfigName
            };
            var updateResponse = await _sageMakerClient.UpdateEndpointAsync(updateRequest);
            Console.WriteLine($"Endpoint updated: {_endpointName}");
            return updateResponse.EndpointArn;
        }
        catch (Exception)
        {
            // Create new endpoint
            var createRequest = new CreateEndpointRequest
            {
                EndpointName = _endpointName,
                EndpointConfigName = endpointConfigName
            };
            var createResponse = await _sageMakerClient.CreateEndpointAsync(createRequest);
            Console.WriteLine($"Endpoint created: {_endpointName}");
            return createResponse.EndpointArn;
        }
    }

    /// <summary>
    /// Invoke SageMaker endpoint for real-time fraud prediction
    /// </summary>
    public async Task<FraudPrediction> PredictAsync(TransactionData transaction)
    {
        // Prepare input data in CSV format for XGBoost
        var inputData = FormatTransactionForSageMaker(transaction);

        var request = new InvokeEndpointRequest
        {
            EndpointName = _endpointName,
            ContentType = "text/csv",
            Body = new MemoryStream(Encoding.UTF8.GetBytes(inputData))
        };

        try
        {
            var response = await _sageMakerRuntime.InvokeEndpointAsync(request);

            // Parse response
            using var reader = new StreamReader(response.Body);
            var predictionResult = await reader.ReadToEndAsync();
            var probability = float.Parse(predictionResult.Trim());

            return new FraudPrediction
            {
                TransactionId = transaction.TransactionId,
                IsFraudulent = probability >= 0.5f,
                FraudProbability = probability,
                ConfidenceScore = Math.Abs(probability - 0.5f) * 2, // Scale to 0-1
                PredictionSource = "SageMaker",
                RecommendedAction = DetermineAction(probability),
                PredictionTimestamp = DateTime.UtcNow,
                RiskFactors = IdentifyRiskFactors(transaction, probability)
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SageMaker prediction error: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Delete an endpoint to save costs
    /// </summary>
    public async Task DeleteEndpointAsync()
    {
        var request = new DeleteEndpointRequest
        {
            EndpointName = _endpointName
        };

        await _sageMakerClient.DeleteEndpointAsync(request);
        Console.WriteLine($"Endpoint deleted: {_endpointName}");
    }

    /// <summary>
    /// Format transaction data for SageMaker XGBoost (CSV format)
    /// </summary>
    private string FormatTransactionForSageMaker(TransactionData transaction)
    {
        // XGBoost expects: feature1,feature2,...,featureN (no label)
        return $"{transaction.Amount}," +
               $"{transaction.TransactionCountLast24Hours}," +
               $"{transaction.AmountSpentLast24Hours}," +
               $"{transaction.TimeSinceLastTransaction ?? 0}," +
               $"{transaction.DistanceFromLastTransaction ?? 0}," +
               $"{(transaction.IsInternational ? 1 : 0)}," +
               $"{(transaction.IsHighRiskMerchant ? 1 : 0)}," +
               $"{transaction.Timestamp.Hour}," +
               $"{(int)transaction.Timestamp.DayOfWeek}";
    }

    /// <summary>
    /// Get XGBoost container image URI for the AWS region
    /// </summary>
    private string GetXGBoostImageUri()
    {
        // Using XGBoost 1.5-1 container
        // Note: Update this based on your AWS region
        return "433757028032.dkr.ecr.us-west-2.amazonaws.com/xgboost:latest";
    }

    /// <summary>
    /// Determine recommended action based on fraud probability
    /// </summary>
    private string DetermineAction(float probability)
    {
        return probability switch
        {
            >= 0.8f => "Decline",
            >= 0.5f => "Review",
            _ => "Approve"
        };
    }

    /// <summary>
    /// Identify risk factors contributing to fraud score
    /// </summary>
    private List<string> IdentifyRiskFactors(TransactionData transaction, float probability)
    {
        var factors = new List<string>();

        if (probability < 0.3f) return factors;

        if (transaction.Amount > 1000)
            factors.Add("High transaction amount");

        if (transaction.IsInternational)
            factors.Add("International transaction");

        if (transaction.IsHighRiskMerchant)
            factors.Add("High-risk merchant category");

        if (transaction.TransactionCountLast24Hours > 10)
            factors.Add("Unusual transaction frequency");

        if (transaction.DistanceFromLastTransaction > 500)
            factors.Add("Large distance from previous transaction");

        return factors;
    }
}

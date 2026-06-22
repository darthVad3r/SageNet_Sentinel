using Amazon.Kinesis;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SageNetSentinel.Contracts;
using SageNetSentinel.Core.Abstractions;

namespace SageNetSentinel.Kinesis.Services;

/// <summary>
/// Background service scaffold that consumes transaction events from a Kinesis stream and calls IFraudDetectionService.
/// This is a skeleton: actual stream name, AWS credentials and checkpointing must be provided by the platform.
/// </summary>
public class KinesisConsumerService : BackgroundService
{
    private readonly ILogger<KinesisConsumerService> _logger;
    private readonly IAmazonKinesis _kinesisClient;
    private readonly IFraudDetectionService _detectionService;

    public KinesisConsumerService(ILogger<KinesisConsumerService> logger,
        IAmazonKinesis kinesisClient,
        IFraudDetectionService detectionService)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _kinesisClient = kinesisClient ?? throw new ArgumentNullException(nameof(kinesisClient));
        _detectionService = detectionService ?? throw new ArgumentNullException(nameof(detectionService));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Kinesis consumer started. (Scaffold only - no streams are provisioned)");

        // TODO: Read stream name from configuration
        var streamName = "TODO_STREAM_NAME";

        // NOTE: This is only scaffolding. Implement record iteration, checkpointing, idempotency and replay safety.
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _logger.LogDebug("Polling Kinesis stream {StreamName} for records (scaffold)", streamName);

                // Placeholder code - do not attempt to call GetRecords without proper shard iterator logic
                // var response = await _kinesisClient.GetRecordsAsync(...);

                // Simulate work
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
            catch (TaskCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                // shutting down
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Kinesis consumer loop");
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        _logger.LogInformation("Kinesis consumer stopping");
    }
}

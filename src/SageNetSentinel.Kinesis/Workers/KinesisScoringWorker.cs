using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SageNetSentinel.Core.Abstractions;
using SageNetSentinel.Kinesis.Configuration;
using SageNetSentinel.Kinesis.Services;

namespace SageNetSentinel.Kinesis.Workers;

public class KinesisScoringWorker : BackgroundService
{
    private readonly IKinesisTransactionConsumer _consumer;
    private readonly IFraudDetectionService _fraudDetectionService;
    private readonly KinesisSettings _settings;
    private readonly KinesisConsumerHealth _health;
    private readonly ILogger<KinesisScoringWorker> _logger;

    public KinesisScoringWorker(
        IKinesisTransactionConsumer consumer,
        IFraudDetectionService fraudDetectionService,
        KinesisSettings settings,
        KinesisConsumerHealth health,
        ILogger<KinesisScoringWorker> logger)
    {
        _consumer = consumer;
        _fraudDetectionService = fraudDetectionService;
        _settings = settings;
        _health = health;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_settings.Enabled)
        {
            _logger.LogInformation("Kinesis worker disabled by configuration");
            return;
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var events = await _consumer.ReceiveBatchAsync(stoppingToken);
                foreach (var transactionEvent in events)
                {
                    var prediction = await _fraudDetectionService.PredictAsync(transactionEvent.ToTransactionData());
                    _logger.LogInformation(
                        "Kinesis scored transaction {TransactionId} for tenant {TenantId}: {Action}",
                        prediction.TransactionId,
                        prediction.TenantId,
                        prediction.RecommendedAction);

                    // TODO(platform-team): Publish scored output to sink/topic for downstream alerting and case management.
                }

                _health.MarkHealthy();
            }
            catch (Exception ex)
            {
                _health.MarkUnhealthy(ex.Message);
                _logger.LogError(ex, "Kinesis scoring worker failed");
            }

            await Task.Delay(TimeSpan.FromSeconds(_settings.PollIntervalSeconds), stoppingToken);
        }
    }
}

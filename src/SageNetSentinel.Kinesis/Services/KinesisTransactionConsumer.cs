using SageNetSentinel.Kinesis.Configuration;
using SageNetSentinel.Kinesis.Contracts;
using System.Text.Json;

namespace SageNetSentinel.Kinesis.Services;

public class KinesisTransactionConsumer : IKinesisTransactionConsumer
{
    private readonly KinesisSettings _settings;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web);

    public KinesisTransactionConsumer(KinesisSettings settings)
    {
        _settings = settings;
    }

    public Task<IReadOnlyCollection<TransactionEvent>> ReceiveBatchAsync(CancellationToken cancellationToken)
    {
        // TODO(platform-team): Wire AWS credentials/IAM role based IAmazonKinesis client and shard iterator consumption.
        // TODO(platform-team): Enforce least-privilege IAM policy for read access to configured stream.
        _ = JsonSerializer.Serialize(_settings, _serializerOptions);
        IReadOnlyCollection<TransactionEvent> events = Array.Empty<TransactionEvent>();
        return Task.FromResult(events);
    }
}

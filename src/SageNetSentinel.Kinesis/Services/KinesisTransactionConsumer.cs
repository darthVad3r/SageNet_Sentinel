using SageNetSentinel.Kinesis.Configuration;
using SageNetSentinel.Kinesis.Contracts;

namespace SageNetSentinel.Kinesis.Services;

public class KinesisTransactionConsumer : IKinesisTransactionConsumer
{
    private readonly KinesisSettings _settings;

    public KinesisTransactionConsumer(KinesisSettings settings)
    {
        _settings = settings;
    }

    public Task<IReadOnlyCollection<TransactionEvent>> ReceiveBatchAsync(CancellationToken cancellationToken)
    {
        // TODO(platform-team): Wire AWS credentials/IAM role based IAmazonKinesis client and shard iterator consumption.
        // TODO(platform-team): Enforce least-privilege IAM policy for read access to configured stream.
        IReadOnlyCollection<TransactionEvent> events = Array.Empty<TransactionEvent>();
        return Task.FromResult(events);
    }
}

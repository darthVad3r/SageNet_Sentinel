using SageNetSentinel.Kinesis.Contracts;

namespace SageNetSentinel.Kinesis.Services;

public interface IKinesisTransactionConsumer
{
    Task<IReadOnlyCollection<TransactionEvent>> ReceiveBatchAsync(CancellationToken cancellationToken);
}

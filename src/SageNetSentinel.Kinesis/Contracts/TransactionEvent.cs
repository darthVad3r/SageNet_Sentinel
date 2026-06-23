using SageNetSentinel.Contracts;

namespace SageNetSentinel.Kinesis.Contracts;

public class TransactionEvent
{
    public string TenantId { get; set; } = string.Empty;
    public string EventId { get; set; } = Guid.NewGuid().ToString("N");
    public DateTime EventTimestampUtc { get; set; } = DateTime.UtcNow;
    public TransactionData Transaction { get; set; } = new();

    public static TransactionEvent FromTransaction(TransactionData transaction)
    {
        return new TransactionEvent
        {
            TenantId = transaction.TenantId,
            Transaction = transaction
        };
    }

    public TransactionData ToTransactionData()
    {
        Transaction.TenantId = TenantId;
        return Transaction;
    }
}

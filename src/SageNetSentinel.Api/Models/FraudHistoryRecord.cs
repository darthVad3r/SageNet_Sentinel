namespace SageNetSentinel.Api.Models;

public class FraudHistoryRecord
{
    public string TenantId { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public bool IsFraudulent { get; set; }
    public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
}

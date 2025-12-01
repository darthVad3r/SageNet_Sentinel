namespace SageNetSentinel.Contracts;

/// <summary>
/// Represents a financial transaction for fraud detection analysis
/// </summary>
public class TransactionData
{
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string MerchantName { get; set; } = string.Empty;
    public string MerchantCategory { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string CardLastFour { get; set; } = string.Empty;
    public string TransactionType { get; set; } = string.Empty; // online, in-store, atm
    public decimal? DistanceFromLastTransaction { get; set; }
    public double? TimeSinceLastTransaction { get; set; } // in minutes
    public int TransactionCountLast24Hours { get; set; }
    public decimal AmountSpentLast24Hours { get; set; }
    public bool IsInternational { get; set; }
    public bool IsHighRiskMerchant { get; set; }
    public string DeviceFingerprint { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
}

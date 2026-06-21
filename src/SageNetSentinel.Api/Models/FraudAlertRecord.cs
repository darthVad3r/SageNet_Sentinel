namespace SageNetSentinel.Api.Models;

public class FraudAlertRecord
{
    public string TenantId { get; set; } = string.Empty;
    public string AlertId { get; set; } = Guid.NewGuid().ToString("N");
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
}

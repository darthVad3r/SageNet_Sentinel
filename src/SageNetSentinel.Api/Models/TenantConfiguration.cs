namespace SageNetSentinel.Api.Models;

public class TenantConfiguration
{
    public string TenantId { get; set; } = string.Empty;
    public string ModelVersion { get; set; } = "1.0.0";
    public bool AlertsEnabled { get; set; } = true;
}

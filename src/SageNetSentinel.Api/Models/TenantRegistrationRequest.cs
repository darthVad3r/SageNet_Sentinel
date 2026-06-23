namespace SageNetSentinel.Api.Models;

public class TenantRegistrationRequest
{
    public string TenantId { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}

using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Contracts;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantController : ControllerBase
{
    // In-memory placeholder store for tenant configuration
    private static readonly Dictionary<string, object> _tenantConfigs = new();

    [HttpGet("{tenantId}")]
    public ActionResult<object> GetTenantConfig(string tenantId)
    {
        if (_tenantConfigs.TryGetValue(tenantId, out var cfg))
            return Ok(cfg);

        return NotFound(new { message = "Tenant not found" });
    }

    [HttpPost("{tenantId}")]
    public ActionResult SetTenantConfig(string tenantId, [FromBody] object config)
    {
        _tenantConfigs[tenantId] = config;
        return Ok(new { message = "Tenant configuration saved" });
    }
}

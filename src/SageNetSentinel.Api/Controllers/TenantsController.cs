using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Api.Models;
using SageNetSentinel.Api.Storage;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly ITenantStore _tenantStore;

    public TenantsController(ITenantStore tenantStore)
    {
        _tenantStore = tenantStore;
    }

    [HttpPost("register")]
    public ActionResult<object> Register([FromBody] TenantRegistrationRequest request)
    {
        var created = _tenantStore.Register(request);
        return created ? Ok(new { message = "Tenant registered", tenantId = request.TenantId }) : Conflict(new { message = "Tenant already exists" });
    }

    [HttpGet("{tenantId}/configuration")]
    public ActionResult<TenantConfiguration> GetConfiguration(string tenantId)
    {
        var config = _tenantStore.GetConfiguration(tenantId);
        return config is null ? NotFound() : Ok(config);
    }
}

using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Api.Storage;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MetadataController : ControllerBase
{
    private readonly IModelMetadataStore _modelMetadataStore;
    private readonly ITenantStore _tenantStore;

    public MetadataController(IModelMetadataStore modelMetadataStore, ITenantStore tenantStore)
    {
        _modelMetadataStore = modelMetadataStore;
        _tenantStore = tenantStore;
    }

    [HttpGet("models")]
    public ActionResult<object> GetModels() => Ok(_modelMetadataStore.GetModels());

    [HttpGet("tenants")]
    public ActionResult<object> GetTenants() => Ok(_tenantStore.GetTenantIds());

    [HttpGet("version")]
    public ActionResult<object> GetVersion() => Ok(new { apiVersion = "v1", runtime = ".NET 9.0" });
}

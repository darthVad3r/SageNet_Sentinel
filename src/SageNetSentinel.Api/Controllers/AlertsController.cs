using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Api.Storage;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly IAlertsRepository _repository;

    public AlertsController(IAlertsRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("{tenantId}")]
    public ActionResult<object> GetAlerts(string tenantId) => Ok(_repository.GetByTenant(tenantId));
}

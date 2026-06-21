using Microsoft.AspNetCore.Mvc;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    [HttpGet("summary/{tenantId}")]
    public ActionResult<object> GetAlertSummary(string tenantId)
    {
        // Placeholder summary
        return Ok(new
        {
            tenantId,
            activeAlerts = 3,
            critical = 1,
            warning = 2,
            lastUpdated = DateTime.UtcNow
        });
    }
}

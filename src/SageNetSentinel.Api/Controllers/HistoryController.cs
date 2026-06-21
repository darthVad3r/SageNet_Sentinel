using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Contracts;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    // Placeholder in-memory history store
    private static readonly List<object> _history = new();

    [HttpGet("{tenantId}")]
    public ActionResult<IEnumerable<object>> GetHistory(string tenantId, int limit = 50)
    {
        // Return last 'limit' mock entries for tenant
        return Ok(_history.TakeLast(limit));
    }

    [HttpPost("record")]
    public ActionResult Record([FromBody] object record)
    {
        _history.Add(record);
        return Ok(new { message = "Recorded" });
    }
}

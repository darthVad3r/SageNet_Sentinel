using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Api.Storage;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FraudHistoryController : ControllerBase
{
    private readonly IFraudHistoryRepository _repository;

    public FraudHistoryController(IFraudHistoryRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("{tenantId}")]
    public ActionResult<object> GetHistory(string tenantId) => Ok(_repository.GetByTenant(tenantId));
}

using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.ML.Abstractions;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MetadataController : ControllerBase
{
    private readonly IModelTrainer _trainer;

    public MetadataController(IModelTrainer trainer)
    {
        _trainer = trainer;
    }

    [HttpGet("model")]
    public ActionResult<object> GetModelMetadata()
    {
        // Minimal metadata; extend as needed
        return Ok(new
        {
            modelVersion = "1.0.0",
            isLoaded = _trainer.IsModelLoaded,
            framework = "ML.NET",
            lastUpdated = DateTime.UtcNow.AddDays(-2)
        });
    }
}

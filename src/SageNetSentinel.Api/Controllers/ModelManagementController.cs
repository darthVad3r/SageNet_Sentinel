using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Contracts;
using SageNetSentinel.Core.Abstractions;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModelManagementController : ControllerBase
{
    private const string ModelVersion = "1.0.0";
    private const string Framework = "ML.NET 5.0";
    private const string Algorithm = "LightGBM";
    private readonly IModelTrainer _modelTrainer;
    private readonly ILogger<ModelManagementController> _logger;

    public ModelManagementController(IModelTrainer modelTrainer, ILogger<ModelManagementController> logger)
    {
        _modelTrainer = modelTrainer;
        _logger = logger;
    }

    [HttpPost("train")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult TrainModel([FromBody] ModelTrainingRequest request)
    {
        try
        {
            _modelTrainer.TrainModel(request.DataSourcePath, request.MaxTrainingTimeSeconds);
            return Ok(new { message = "Model training completed successfully", modelType = request.ModelType });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error training model");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<object> GetModelStatus()
    {
        return Ok(new
        {
            mlNetModelLoaded = _modelTrainer.IsModelLoaded,
            modelVersion = ModelVersion,
            framework = Framework,
            algorithm = Algorithm
        });
    }
}

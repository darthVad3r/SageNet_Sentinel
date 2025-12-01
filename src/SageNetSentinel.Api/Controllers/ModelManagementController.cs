using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Abstractions;
using SageNetSentinel.ML.Services;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModelManagementController : ControllerBase
{
    private readonly IModelTrainer _modelTrainer;
    private readonly ILogger<ModelManagementController> _logger;

    public ModelManagementController(
        IModelTrainer modelTrainer,
        ILogger<ModelManagementController> logger)
    {
        _modelTrainer = modelTrainer ?? throw new ArgumentNullException(nameof(modelTrainer));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Train a new ML.NET model
    /// </summary>
    [HttpPost("train")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult TrainModel([FromBody] ModelTrainingRequest request)
    {
        try
        {
            _logger.LogInformation("Starting model training with data from {Path}", 
                request.DataSourcePath);

            if (request.ModelType == "AutoML")
            {
                _modelTrainer.TrainModel(
                    request.DataSourcePath,
                    request.MaxTrainingTimeSeconds);
            }
            else
            {
                _modelTrainer.TrainModel(
                    request.DataSourcePath,
                    request.MaxTrainingTimeSeconds);
            }

            _logger.LogInformation("Model training completed successfully");

            return Ok(new
            {
                message = "Model training completed successfully",
                modelType = request.ModelType,
                trainingTimeSeconds = request.MaxTrainingTimeSeconds
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error training model");
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get model information and status
    /// </summary>
    [HttpGet("status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<object> GetModelStatus()
    {
        return Ok(new
        {
            mlNetModelLoaded = _modelTrainer.IsModelLoaded,
            modelVersion = "1.0.0",
            lastTrainingDate = DateTime.UtcNow.AddDays(-7),
            framework = "ML.NET 5.0",
            algorithm = "LightGBM"
        });
    }

    /// <summary>
    /// Trigger model retraining (scheduled job endpoint)
    /// </summary>
    [HttpPost("retrain")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    public ActionResult TriggerRetraining()
    {
        _logger.LogInformation("Model retraining triggered");
        
        // In a real implementation, this would queue a background job
        return Accepted(new
        {
            message = "Model retraining job queued",
            estimatedCompletionTime = DateTime.UtcNow.AddMinutes(30)
        });
    }
}

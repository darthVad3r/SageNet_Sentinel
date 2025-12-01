using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Services;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FraudDetectionController : ControllerBase
{
    private readonly EnsembleFraudDetectionService _fraudDetectionService;
    private readonly ILogger<FraudDetectionController> _logger;

    public FraudDetectionController(
        EnsembleFraudDetectionService fraudDetectionService,
        ILogger<FraudDetectionController> logger)
    {
        _fraudDetectionService = fraudDetectionService;
        _logger = logger;
    }

    /// <summary>
    /// Analyze a single transaction for fraud
    /// </summary>
    [HttpPost("analyze")]
    [ProducesResponseType(typeof(FraudPrediction), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FraudPrediction>> AnalyzeTransaction(
        [FromBody] FraudDetectionRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Analyzing transaction {TransactionId} for fraud",
                request.Transaction.TransactionId);

            var prediction = await _fraudDetectionService.PredictWithEnsembleAsync(
                request.Transaction);

            _logger.LogInformation(
                "Transaction {TransactionId} analyzed: IsFraud={IsFraud}, Probability={Probability:F3}, Action={Action}",
                request.Transaction.TransactionId,
                prediction.IsFraudulent,
                prediction.FraudProbability,
                prediction.RecommendedAction);

            return Ok(prediction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing transaction {TransactionId}",
                request.Transaction.TransactionId);
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Analyze multiple transactions in batch
    /// </summary>
    [HttpPost("analyze/batch")]
    [ProducesResponseType(typeof(List<FraudPrediction>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<FraudPrediction>>> AnalyzeBatch(
        [FromBody] List<TransactionData> transactions)
    {
        try
        {
            _logger.LogInformation("Analyzing batch of {Count} transactions", transactions.Count);

            var predictions = new List<FraudPrediction>();
            
            foreach (var transaction in transactions)
            {
                var prediction = await _fraudDetectionService.PredictWithEnsembleAsync(transaction);
                predictions.Add(prediction);
            }

            var fraudCount = predictions.Count(p => p.IsFraudulent);
            _logger.LogInformation(
                "Batch analysis complete: {Total} transactions, {Fraud} flagged as fraud",
                predictions.Count, fraudCount);

            return Ok(predictions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing batch transactions");
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get fraud statistics summary
    /// </summary>
    [HttpGet("statistics")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<object> GetStatistics()
    {
        // In a real implementation, this would query a database
        // For now, return mock statistics
        return Ok(new
        {
            totalTransactionsAnalyzed = 10523,
            fraudDetected = 127,
            falsePositiveRate = 0.012,
            averageResponseTimeMs = 45,
            modelAccuracy = 0.973,
            lastModelUpdate = DateTime.UtcNow.AddDays(-2)
        });
    }

    /// <summary>
    /// Health check endpoint
    /// </summary>
    [HttpGet("health")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<object> HealthCheck()
    {
        return Ok(new
        {
            status = "Healthy",
            timestamp = DateTime.UtcNow,
            service = "SageNetSentinel Fraud Detection",
            version = "1.0.0"
        });
    }
}

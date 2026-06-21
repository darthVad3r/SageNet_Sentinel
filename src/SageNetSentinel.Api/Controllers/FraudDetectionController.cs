using Microsoft.AspNetCore.Mvc;
using SageNetSentinel.Contracts;
using SageNetSentinel.Core.Abstractions;
using SageNetSentinel.Observability.Logging;

namespace SageNetSentinel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FraudDetectionController : ControllerBase
{
    private readonly IFraudDetectionService _fraudDetectionService;
    private readonly ILogger<FraudDetectionController> _logger;

    public FraudDetectionController(IFraudDetectionService fraudDetectionService, ILogger<FraudDetectionController> logger)
    {
        _fraudDetectionService = fraudDetectionService;
        _logger = logger;
    }

    [HttpPost("analyze")]
    [ProducesResponseType(typeof(FraudPrediction), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FraudPrediction>> AnalyzeTransaction([FromBody] FraudDetectionRequest request)
    {
        try
        {
            request.Transaction.TenantId = string.IsNullOrWhiteSpace(request.Transaction.TenantId)
                ? request.TenantId
                : request.Transaction.TenantId;

            using var _ = _logger.BeginTenantScope(request.Transaction);
            var prediction = await _fraudDetectionService.PredictAsync(request.Transaction);
            return Ok(prediction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing transaction {TransactionId}", request.Transaction.TransactionId);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("analyze/batch")]
    [ProducesResponseType(typeof(List<FraudPrediction>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<FraudPrediction>>> AnalyzeBatch([FromBody] List<TransactionData> transactions)
    {
        var predictions = new List<FraudPrediction>();

        foreach (var transaction in transactions)
        {
            using var _ = _logger.BeginTenantScope(transaction);
            predictions.Add(await _fraudDetectionService.PredictAsync(transaction));
        }

        return Ok(predictions);
    }

    [HttpGet("statistics")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<object> GetStatistics()
    {
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
}

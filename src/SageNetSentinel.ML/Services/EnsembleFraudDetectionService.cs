using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Abstractions;
using Microsoft.Extensions.Logging;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Ensemble service that combines multiple fraud detection models to reduce false positives
/// </summary>
public class EnsembleFraudDetectionService : IFraudDetectionService
{
    private readonly IEnumerable<IFraudDetectionService> _detectionServices;
    private readonly IEnsembleStrategy _ensembleStrategy;
    private readonly RuleBasedOverrideService _ruleBasedOverrideService;
    private readonly ILogger<EnsembleFraudDetectionService> _logger;

    public string ServiceName => "Ensemble";

    public EnsembleFraudDetectionService(
        IEnumerable<IFraudDetectionService> detectionServices,
        IEnsembleStrategy ensembleStrategy,
        FalsePositiveReductionConfig config,
        ILogger<EnsembleFraudDetectionService> logger)
    {
        _detectionServices = detectionServices ?? throw new ArgumentNullException(nameof(detectionServices));
        _ensembleStrategy = ensembleStrategy ?? throw new ArgumentNullException(nameof(ensembleStrategy));
        _ruleBasedOverrideService = new RuleBasedOverrideService(config);
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Predict fraud using ensemble approach with false positive reduction
    /// </summary>
    public async Task<FraudPrediction> PredictAsync(TransactionData transaction)
    {
        var predictions = await GatherPredictionsAsync(transaction);

        if (predictions.Count == 0)
        {
            throw new InvalidOperationException("No prediction services available or all failed");
        }

        // Use single prediction if only one service succeeded
        if (predictions.Count == 1)
        {
            return _ruleBasedOverrideService.ApplyOverrides(predictions[0], transaction);
        }

        // Apply ensemble strategy
        var ensemblePrediction = _ensembleStrategy.CombinePredictions(predictions, transaction);

        // Apply rule-based overrides to reduce false positives
        return _ruleBasedOverrideService.ApplyOverrides(ensemblePrediction, transaction);
    }

    private async Task<List<FraudPrediction>> GatherPredictionsAsync(TransactionData transaction)
    {
        var predictions = new List<FraudPrediction>();
        
        foreach (var service in _detectionServices)
        {
            try
            {
                var prediction = await service.PredictAsync(transaction);
                predictions.Add(prediction);
                
                _logger.LogDebug("Received prediction from {ServiceName}: IsFraud={IsFraud}, Probability={Probability:F3}",
                    service.ServiceName, prediction.IsFraudulent, prediction.FraudProbability);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Prediction from {ServiceName} failed for transaction {TransactionId}",
                    service.ServiceName, transaction.TransactionId);
            }
        }

        return predictions;
    }
}

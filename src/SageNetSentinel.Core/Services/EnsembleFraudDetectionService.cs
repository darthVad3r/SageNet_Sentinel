using Microsoft.Extensions.Logging;
using SageNetSentinel.Contracts;
using SageNetSentinel.Core.Abstractions;
using SageNetSentinel.Core.Configuration;

namespace SageNetSentinel.Core.Services;

public class EnsembleFraudDetectionService : IFraudDetectionService
{
    private readonly IEnumerable<IFraudDetectionService> _detectionServices;
    private readonly IEnsembleStrategy _ensembleStrategy;
    private readonly RuleBasedOverrideService _ruleBasedOverrideService;
    private readonly RuleBasedDecisionService _ruleBasedDecisionService;
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
        _ruleBasedDecisionService = new RuleBasedDecisionService();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<FraudPrediction> PredictAsync(TransactionData transaction)
    {
        var predictions = new List<FraudPrediction>();
        foreach (var service in _detectionServices)
        {
            try
            {
                // TODO(platform-team): Add tenant-aware model selection and routing by transaction.TenantId.
                predictions.Add(await service.PredictAsync(transaction));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Prediction from {ServiceName} failed for transaction {TransactionId}", service.ServiceName, transaction.TransactionId);
            }
        }

        if (predictions.Count == 0)
        {
            throw new InvalidOperationException("No prediction services available or all failed");
        }

        var prediction = predictions.Count == 1
            ? predictions[0]
            : _ensembleStrategy.CombinePredictions(predictions, transaction);

        prediction = _ruleBasedOverrideService.ApplyOverrides(prediction, transaction);
        return _ruleBasedDecisionService.ApplyBusinessRules(prediction, transaction);
    }
}

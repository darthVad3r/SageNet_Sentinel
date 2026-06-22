using Grpc.Core;
using SageNetSentinel.Core.Abstractions;

namespace SageNetSentinel.Grpc.Services;

/// <summary>
/// gRPC service wrapper that delegates scoring requests to IFraudDetectionService.
/// </summary>
public class FraudScoringGrpcService : SageNetSentinel.Grpc.Protos.Scoring.ScoringBase
{
    private readonly IFraudDetectionService _detectionService;
    private readonly ILogger<FraudScoringGrpcService> _logger;

    public FraudScoringGrpcService(IFraudDetectionService detectionService, ILogger<FraudScoringGrpcService> logger)
    {
        _detectionService = detectionService ?? throw new ArgumentNullException(nameof(detectionService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public override async Task<SageNetSentinel.Grpc.Protos.FraudScoringResponse> Score(
        SageNetSentinel.Grpc.Protos.FraudScoringRequest request,
        ServerCallContext context)
    {
        var txn = Map(request.Transaction);
        var tenantId = string.IsNullOrWhiteSpace(request.TenantId) ? "default" : request.TenantId;

        _logger.LogDebug("gRPC scoring request received for tenant {TenantId}, transaction {TransactionId}",
            tenantId, txn.TransactionId);

        var prediction = await _detectionService.PredictAsync(txn);

        return new SageNetSentinel.Grpc.Protos.FraudScoringResponse
        {
            IsFraudulent = prediction.IsFraudulent,
            FraudProbability = prediction.FraudProbability,
            RecommendedAction = prediction.RecommendedAction ?? string.Empty,
            ModelVersion = prediction.PredictionSource ?? string.Empty,
            DebugInfo = string.Join(",", prediction.RiskFactors)
        };
    }

    private static SageNetSentinel.Contracts.TransactionData Map(SageNetSentinel.Grpc.Protos.TransactionData src)
    {
        if (src == null) return new SageNetSentinel.Contracts.TransactionData();

        return new SageNetSentinel.Contracts.TransactionData
        {
            TransactionId = src.TransactionId ?? string.Empty,
            Amount = (decimal)src.Amount,
            MerchantName = src.MerchantName ?? string.Empty,
            MerchantCategory = src.MerchantCategory ?? string.Empty,
            Location = src.Location ?? string.Empty,
            Country = src.Country ?? string.Empty,
            Timestamp = DateTime.TryParse(src.Timestamp, out var t) ? t : DateTime.UtcNow,
            UserId = src.UserId ?? string.Empty,
            CardLastFour = src.CardLastFour ?? string.Empty,
            TransactionType = src.TransactionType ?? string.Empty,
            DistanceFromLastTransaction = src.DistanceFromLastTransaction == 0 ? null : (decimal?)src.DistanceFromLastTransaction,
            TimeSinceLastTransaction = src.TimeSinceLastTransaction == 0 ? null : (double?)src.TimeSinceLastTransaction,
            TransactionCountLast24Hours = src.TransactionCountLast24Hours,
            AmountSpentLast24Hours = (decimal)src.AmountSpentLast24Hours,
            IsInternational = src.IsInternational,
            IsHighRiskMerchant = src.IsHighRiskMerchant,
            DeviceFingerprint = src.DeviceFingerprint ?? string.Empty,
            IpAddress = src.IpAddress ?? string.Empty
        };
    }
}

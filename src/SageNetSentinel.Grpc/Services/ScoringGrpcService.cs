using Grpc.Core;
using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Abstractions;

namespace SageNetSentinel.Grpc.Services;

/// <summary>
/// gRPC service wrapper that delegates scoring requests to the existing IFraudDetectionService.
/// This is intentionally thin: performance-sensitive mapping lives here; heavy work stays in the ML layer.
/// TODO: Add mTLS server configuration hooks (platform team will provide certificates and registry info).
/// </summary>
public class ScoringGrpcService : SageNetSentinel.Grpc.Protos.Scoring.ScoringBase
{
    private readonly IFraudDetectionService _detectionService;
    private readonly ILogger<ScoringGrpcService> _logger;

    public ScoringGrpcService(IFraudDetectionService detectionService, ILogger<ScoringGrpcService> logger)
    {
        _detectionService = detectionService ?? throw new ArgumentNullException(nameof(detectionService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public override async Task<SageNetSentinel.Grpc.Protos.FraudScoringResponse> Score(
        SageNetSentinel.Grpc.Protos.FraudScoringRequest request,
        ServerCallContext context)
    {
        // Map proto TransactionData to Contracts.TransactionData
        var txn = Map(request.Transaction);

        // TenantId enforcement: ensure the request contains tenant information
        var tenantId = string.IsNullOrWhiteSpace(request.TenantId) ? "default" : request.TenantId;

        _logger.LogDebug("gRPC scoring request received for tenant {TenantId}, transaction {TransactionId}",
            tenantId, txn.TransactionId);

        // Attach tenant metadata to logging or observability systems as needed (TODO)

        var prediction = await _detectionService.PredictAsync(txn);

        return new SageNetSentinel.Grpc.Protos.FraudScoringResponse
        {
            IsFraudulent = prediction.IsFraudulent,
            FraudProbability = prediction.FraudProbability,
            RecommendedAction = prediction.RecommendedAction ?? string.Empty,
            ModelVersion = prediction.ModelVersion ?? string.Empty,
            DebugInfo = prediction.DebugInfo ?? string.Empty
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

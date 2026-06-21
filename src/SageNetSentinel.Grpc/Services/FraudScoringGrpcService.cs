using Grpc.Core;
using SageNetSentinel.Contracts;
using TransactionContract = SageNetSentinel.Contracts.TransactionData;
using SageNetSentinel.Core.Abstractions;
using SageNetSentinel.Grpc.Protos;

namespace SageNetSentinel.Grpc.Services;

public class FraudScoringGrpcService : Protos.FraudScoringService.FraudScoringServiceBase
{
    private readonly IFraudDetectionService _fraudDetectionService;

    public FraudScoringGrpcService(IFraudDetectionService fraudDetectionService)
    {
        _fraudDetectionService = fraudDetectionService;
    }

    public override async Task<FraudScoringResponse> Score(FraudScoringRequest request, ServerCallContext context)
    {
        // TODO(platform-team): Configure mTLS certificates for gRPC secure channels.
        // TODO(platform-team): Integrate gRPC service with service registry/discovery.

        var transaction = request.Transaction;
        if (!DateTime.TryParse(transaction.TimestampUtc, out var parsedTimestamp))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Invalid transaction timestamp_utc."));
        }

        var prediction = await _fraudDetectionService.PredictAsync(new TransactionContract
        {
            TenantId = transaction.TenantId,
            TransactionId = transaction.TransactionId,
            Amount = (decimal)transaction.Amount,
            MerchantName = transaction.MerchantName,
            MerchantCategory = transaction.MerchantCategory,
            Location = transaction.Location,
            Country = transaction.Country,
            Timestamp = parsedTimestamp,
            UserId = transaction.UserId,
            CardLastFour = transaction.CardLastFour,
            TransactionType = transaction.TransactionType,
            DistanceFromLastTransaction = transaction.DistanceFromLastTransaction == 0 ? null : (decimal?)transaction.DistanceFromLastTransaction,
            TimeSinceLastTransaction = transaction.TimeSinceLastTransaction == 0 ? null : transaction.TimeSinceLastTransaction,
            TransactionCountLast24Hours = transaction.TransactionCountLast24Hours,
            AmountSpentLast24Hours = (decimal)transaction.AmountSpentLast24Hours,
            IsInternational = transaction.IsInternational,
            IsHighRiskMerchant = transaction.IsHighRiskMerchant,
            DeviceFingerprint = transaction.DeviceFingerprint,
            IpAddress = transaction.IpAddress
        });

        return new FraudScoringResponse
        {
            TenantId = prediction.TenantId,
            TransactionId = prediction.TransactionId,
            IsFraudulent = prediction.IsFraudulent,
            FraudProbability = prediction.FraudProbability,
            ConfidenceScore = prediction.ConfidenceScore,
            RecommendedAction = prediction.RecommendedAction,
            PredictionSource = prediction.PredictionSource,
            RiskFactors = { prediction.RiskFactors }
        };
    }
}

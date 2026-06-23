using Xunit;

using SageNetSentinel.Core.Services;
using SageNetSentinel.Core.Configuration;
using SageNetSentinel.Contracts;

namespace SageNetSentinel.Core.Tests.Services;

public class WeightedAverageEnsembleStrategyTests
{
    private readonly FalsePositiveReductionConfig _config = new()
    {
        MLNetWeight = 1.0f,
        SageMakerWeight = 1.0f,
        FraudThreshold = 0.5f,
        DisagreementThreshold = 0.7f
    };

    private TransactionData CreateTestTransaction(string transactionId = "TEST001")
    {
        return new TransactionData
        {
            TenantId = "tenant-1",
            TransactionId = transactionId,
            Amount = 100m,
            MerchantName = "Test Merchant",
            MerchantCategory = "Retail",
            Location = "Seattle, WA",
            Country = "USA",
            Timestamp = DateTime.UtcNow,
            UserId = "user-123",
            CardLastFour = "1234",
            TransactionType = "in-store",
            TimeSinceLastTransaction = 300,
            TransactionCountLast24Hours = 2,
            AmountSpentLast24Hours = 250m,
            IsInternational = false,
            IsHighRiskMerchant = false
        };
    }

    [Fact]
    public void CombinePredictions_WithNullList_ThrowsException()
    {
        var ensemble = new WeightedAverageEnsembleStrategy(_config);
        var transaction = CreateTestTransaction();

        var exception = Assert.Throws<ArgumentException>(() =>
            ensemble.CombinePredictions(null, transaction));

        Assert.Contains("At least one prediction is required", exception.Message);
    }

    [Fact]
    public void CombinePredictions_WithEmptyList_ThrowsException()
    {
        var ensemble = new WeightedAverageEnsembleStrategy(_config);
        var transaction = CreateTestTransaction();

        var exception = Assert.Throws<ArgumentException>(() =>
            ensemble.CombinePredictions(new List<FraudPrediction>(), transaction));

        Assert.Contains("At least one prediction is required", exception.Message);
    }

    [Fact]
    public void CombinePredictions_WithSinglePrediction_ReturnsSamePrediction()
    {
        var ensemble = new WeightedAverageEnsembleStrategy(_config);
        var transaction = CreateTestTransaction();
        var prediction = new FraudPrediction
        {
            TenantId = "tenant-1",
            TransactionId = "TEST001",
            IsFraudulent = true,
            FraudProbability = 0.8f,
            ConfidenceScore = 0.95f,
            PredictionSource = "MLNet"
        };

        var result = ensemble.CombinePredictions(new List<FraudPrediction> { prediction }, transaction);

        Assert.Equal(prediction, result);
    }

    [Fact]
    public void CombinePredictions_BothAgree_AppliesFraudThreshold()
    {
        var ensemble = new WeightedAverageEnsembleStrategy(_config);
        var transaction = CreateTestTransaction();

        var predictions = new List<FraudPrediction>
        {
            new()
            {
                TenantId = "tenant-1",
                TransactionId = "TEST001",
                IsFraudulent = true,
                FraudProbability = 0.6f,
                ConfidenceScore = 0.9f,
                PredictionSource = "MLNet"
            },
            new()
            {
                TenantId = "tenant-1",
                TransactionId = "TEST001",
                IsFraudulent = true,
                FraudProbability = 0.7f,
                ConfidenceScore = 0.85f,
                PredictionSource = "SageMaker"
            }
        };

        var result = ensemble.CombinePredictions(predictions, transaction);

        // Average probability: (0.6 + 0.7) / 2 = 0.65, which is above threshold (0.5)
        Assert.True(result.IsFraudulent);
        Assert.Equal(0.65f, result.FraudProbability, 2);
        Assert.Equal("Review", result.RecommendedAction);
    }

    [Fact]
    public void CombinePredictions_Disagree_AppliesDisagreementThreshold()
    {
        var ensemble = new WeightedAverageEnsembleStrategy(_config);
        var transaction = CreateTestTransaction();

        var predictions = new List<FraudPrediction>
        {
            new()
            {
                TenantId = "tenant-1",
                TransactionId = "TEST001",
                IsFraudulent = false,
                FraudProbability = 0.3f,
                ConfidenceScore = 0.9f,
                PredictionSource = "MLNet"
            },
            new()
            {
                TenantId = "tenant-1",
                TransactionId = "TEST001",
                IsFraudulent = true,
                FraudProbability = 0.8f,
                ConfidenceScore = 0.85f,
                PredictionSource = "SageMaker"
            }
        };

        var result = ensemble.CombinePredictions(predictions, transaction);

        // Average: (0.3 + 0.8) / 2 = 0.55
        // Models disagree, so check against DisagreementThreshold (0.7)
        // 0.55 < 0.7, so IsFraudulent = false
        // But since 0.55 >= FraudThreshold (0.5), RecommendedAction = "Review"
        Assert.False(result.IsFraudulent);
        Assert.Equal("Review", result.RecommendedAction);
    }

    [Fact]
    public void CombinePredictions_SetsPredictionSourceToEnsemble()
    {
        var ensemble = new WeightedAverageEnsembleStrategy(_config);
        var transaction = CreateTestTransaction();

        var predictions = new List<FraudPrediction>
        {
            new() { FraudProbability = 0.5f, ConfidenceScore = 0.9f, IsFraudulent = false },
            new() { FraudProbability = 0.6f, ConfidenceScore = 0.85f, IsFraudulent = false }
        };

        var result = ensemble.CombinePredictions(predictions, transaction);

        Assert.Equal("Ensemble", result.PredictionSource);
    }

    [Fact]
    public void Constructor_WithInvalidWeights_DefaultsToEqualWeights()
    {
        var config = new FalsePositiveReductionConfig
        {
            MLNetWeight = 0f,
            SageMakerWeight = 0f,
            FraudThreshold = 0.5f,
            DisagreementThreshold = 0.7f
        };

        var ensemble = new WeightedAverageEnsembleStrategy(config);
        var transaction = CreateTestTransaction();

        var predictions = new List<FraudPrediction>
        {
            new() { FraudProbability = 0.4f, ConfidenceScore = 0.9f, IsFraudulent = false },
            new() { FraudProbability = 0.6f, ConfidenceScore = 0.85f, IsFraudulent = true }
        };

        var result = ensemble.CombinePredictions(predictions, transaction);

        // With equal weights: (0.4 + 0.6) / 2 = 0.5
        Assert.Equal(0.5f, result.FraudProbability, 2);
    }
}

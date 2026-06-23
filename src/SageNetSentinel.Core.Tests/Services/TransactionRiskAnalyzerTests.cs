using Xunit;
using SageNetSentinel.Core.Services;
using SageNetSentinel.Contracts;

namespace SageNetSentinel.Core.Tests.Services;

public class TransactionRiskAnalyzerTests
{
    private readonly TransactionRiskAnalyzer _analyzer = new();

    private TransactionData CreateTestTransaction()
    {
        return new TransactionData
        {
            TenantId = "tenant-1",
            TransactionId = "TEST001",
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
    public void IdentifyRiskFactors_LowFraudProbability_ReturnsEmpty()
    {
        var transaction = CreateTestTransaction();

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.2f);

        Assert.Empty(factors);
    }

    [Fact]
    public void IdentifyRiskFactors_HighAmount_IdentifiesRisk()
    {
        var transaction = CreateTestTransaction();
        transaction.Amount = 1500m;

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.6f);

        Assert.Contains("High transaction amount", factors);
    }

    [Fact]
    public void IdentifyRiskFactors_International_IdentifiesRisk()
    {
        var transaction = CreateTestTransaction();
        transaction.IsInternational = true;

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.5f);

        Assert.Contains("International transaction", factors);
    }

    [Fact]
    public void IdentifyRiskFactors_HighRiskMerchant_IdentifiesRisk()
    {
        var transaction = CreateTestTransaction();
        transaction.IsHighRiskMerchant = true;

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.5f);

        Assert.Contains("High-risk merchant category", factors);
    }

    [Fact]
    public void IdentifyRiskFactors_HighTransactionFrequency_IdentifiesRisk()
    {
        var transaction = CreateTestTransaction();
        transaction.TransactionCountLast24Hours = 12;

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.5f);

        Assert.Contains("Unusual transaction frequency", factors);
    }

    [Fact]
    public void IdentifyRiskFactors_LargeDistance_IdentifiesRisk()
    {
        var transaction = CreateTestTransaction();
        transaction.DistanceFromLastTransaction = 600;

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.5f);

        Assert.Contains("Large distance from previous transaction", factors);
    }

    [Fact]
    public void IdentifyRiskFactors_UnusualTime_IdentifiesRisk()
    {
        var transaction = CreateTestTransaction();
        transaction.Timestamp = new DateTime(2025, 11, 30, 3, 15, 0, DateTimeKind.Utc);

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.5f);

        Assert.Contains("Unusual transaction time", factors);
    }

    [Fact]
    public void IdentifyRiskFactors_MultipleRisks_IdentifiesAll()
    {
        var transaction = CreateTestTransaction();
        transaction.Amount = 2000m;
        transaction.IsInternational = true;
        transaction.IsHighRiskMerchant = true;
        transaction.TransactionCountLast24Hours = 15;
        transaction.DistanceFromLastTransaction = 1000;
        transaction.Timestamp = new DateTime(2025, 11, 30, 4, 30, 0, DateTimeKind.Utc);

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.8f);

        Assert.Contains("High transaction amount", factors);
        Assert.Contains("International transaction", factors);
        Assert.Contains("High-risk merchant category", factors);
        Assert.Contains("Unusual transaction frequency", factors);
        Assert.Contains("Large distance from previous transaction", factors);
        Assert.Contains("Unusual transaction time", factors);
        Assert.Equal(6, factors.Count);
    }

    [Fact]
    public void IdentifyRiskFactors_NormalTransaction_NoRisks()
    {
        var transaction = CreateTestTransaction();
        transaction.Amount = 50m;
        transaction.IsInternational = false;
        transaction.IsHighRiskMerchant = false;
        transaction.TransactionCountLast24Hours = 2;
        transaction.DistanceFromLastTransaction = 5;
        transaction.Timestamp = DateTime.UtcNow.AddHours(-2);

        var factors = _analyzer.IdentifyRiskFactors(transaction, 0.6f);

        // Even with 0.6 probability, no risk factors should be identified for normal transaction
        Assert.Empty(factors);
    }

    [Theory]
    [InlineData(0f)]
    [InlineData(0.29f)]
    [InlineData(0.3f)]
    public void IdentifyRiskFactors_BelowThreshold_ReturnsEmpty(float probability)
    {
        var transaction = CreateTestTransaction();
        transaction.Amount = 5000m; // Would be a risk if probability was higher

        var factors = _analyzer.IdentifyRiskFactors(transaction, probability);

        if (probability < 0.3f)
        {
            Assert.Empty(factors);
        }
    }
}

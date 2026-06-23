using Xunit;

using Moq;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using SageNetSentinel.Api.Controllers;
using SageNetSentinel.Contracts;
using SageNetSentinel.Core.Abstractions;

namespace SageNetSentinel.Api.Tests.Controllers;

public class FraudDetectionControllerTests
{
    private readonly Mock<IFraudDetectionService> _mockFraudService;
    private readonly Mock<ILogger<FraudDetectionController>> _mockLogger;

    public FraudDetectionControllerTests()
    {
        _mockFraudService = new Mock<IFraudDetectionService>();
        _mockLogger = new Mock<ILogger<FraudDetectionController>>();
    }

    private TransactionData CreateTestTransaction(string transactionId = "TEST001", string tenantId = "tenant-1")
    {
        return new TransactionData
        {
            TenantId = tenantId,
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

    private FraudPrediction CreateTestPrediction(string transactionId = "TEST001", bool isFraudulent = false)
    {
        return new FraudPrediction
        {
            TenantId = "tenant-1",
            TransactionId = transactionId,
            IsFraudulent = isFraudulent,
            FraudProbability = isFraudulent ? 0.8f : 0.2f,
            ConfidenceScore = 0.9f,
            PredictionSource = "MLNet",
            RecommendedAction = isFraudulent ? "Decline" : "Approve",
            PredictionTimestamp = DateTime.UtcNow,
            RiskFactors = isFraudulent ? new List<string> { "High amount" } : new List<string>()
        };
    }

    [Fact]
    public async Task AnalyzeTransaction_WithValidRequest_ReturnsOk()
    {
        var transaction = CreateTestTransaction();
        var request = new FraudDetectionRequest
        {
            TenantId = "tenant-1",
            Transaction = transaction
        };
        var prediction = CreateTestPrediction();

        _mockFraudService.Setup(s => s.PredictAsync(It.IsAny<TransactionData>()))
            .ReturnsAsync(prediction);

        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = await controller.AnalyzeTransaction(request);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(prediction, okResult.Value);
    }

    [Fact]
    public async Task AnalyzeTransaction_WithoutTenantId_ReturnsBadRequest()
    {
        var transaction = CreateTestTransaction();
        transaction.TenantId = null;
        var request = new FraudDetectionRequest
        {
            TenantId = null,
            Transaction = transaction
        };

        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = await controller.AnalyzeTransaction(request);

        var badResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badResult.Value);
    }

    [Fact]
    public async Task AnalyzeTransaction_WithMismatchedTenantIds_ReturnsBadRequest()
    {
        var transaction = CreateTestTransaction(tenantId: "tenant-1");
        var request = new FraudDetectionRequest
        {
            TenantId = "tenant-2",
            Transaction = transaction
        };

        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = await controller.AnalyzeTransaction(request);

        var badResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badResult.Value);
    }

    [Fact]
    public async Task AnalyzeTransaction_WithRequestTenantIdOnly_UsesTenantIdForTransaction()
    {
        var transaction = CreateTestTransaction();
        transaction.TenantId = null;
        var request = new FraudDetectionRequest
        {
            TenantId = "tenant-1",
            Transaction = transaction
        };
        var prediction = CreateTestPrediction();

        _mockFraudService.Setup(s => s.PredictAsync(It.IsAny<TransactionData>()))
            .ReturnsAsync(prediction);

        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = await controller.AnalyzeTransaction(request);

        Assert.IsType<OkObjectResult>(result.Result);
        _mockFraudService.Verify(s => s.PredictAsync(It.Is<TransactionData>(
            t => t.TenantId == "tenant-1")), Times.Once);
    }

    [Fact]
    public async Task AnalyzeTransaction_WhenServiceThrows_ReturnsBadRequest()
    {
        var request = new FraudDetectionRequest
        {
            TenantId = "tenant-1",
            Transaction = CreateTestTransaction()
        };

        _mockFraudService.Setup(s => s.PredictAsync(It.IsAny<TransactionData>()))
            .ThrowsAsync(new Exception("Service error"));

        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = await controller.AnalyzeTransaction(request);

        var badResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badResult.Value);
    }

    [Fact]
    public async Task AnalyzeBatch_WithValidTransactions_ReturnsOk()
    {
        var transactions = new List<TransactionData>
        {
            CreateTestTransaction("TEST001"),
            CreateTestTransaction("TEST002"),
            CreateTestTransaction("TEST003")
        };

        var predictions = new List<FraudPrediction>
        {
            CreateTestPrediction("TEST001"),
            CreateTestPrediction("TEST002"),
            CreateTestPrediction("TEST003")
        };

        var callCount = 0;
        _mockFraudService.Setup(s => s.PredictAsync(It.IsAny<TransactionData>()))
            .ReturnsAsync(() => predictions[callCount++]);

        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = await controller.AnalyzeBatch(transactions);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedPredictions = Assert.IsType<List<FraudPrediction>>(okResult.Value);
        Assert.Equal(3, returnedPredictions.Count);
        _mockFraudService.Verify(s => s.PredictAsync(It.IsAny<TransactionData>()), Times.Exactly(3));
    }

    [Fact]
    public async Task AnalyzeBatch_WithEmptyList_ReturnsOk()
    {
        var transactions = new List<TransactionData>();

        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = await controller.AnalyzeBatch(transactions);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedPredictions = Assert.IsType<List<FraudPrediction>>(okResult.Value);
        Assert.Empty(returnedPredictions);
    }

    [Fact]
    public void GetStatistics_ReturnsOk()
    {
        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = controller.GetStatistics();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public void GetStatistics_ReturnsExpectedMetrics()
    {
        var controller = new FraudDetectionController(_mockFraudService.Object, _mockLogger.Object);
        var result = controller.GetStatistics();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.NotNull(okResult.Value);
    }
}

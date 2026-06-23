using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using SageNetSentinel.ML.Services;
using SageNetSentinel.Contracts;
using SageNetSentinel.Core.Abstractions;

namespace SageNetSentinel.ML.Tests.Services;

public class MLNetFraudDetectionServiceTests
{
    private readonly Mock<IModelRepository> _mockModelRepository;
    private readonly Mock<IRiskAnalyzer> _mockRiskAnalyzer;
    private readonly Mock<ILogger<MLNetFraudDetectionService>> _mockLogger;

    public MLNetFraudDetectionServiceTests()
    {
        _mockModelRepository = new Mock<IModelRepository>();
        _mockRiskAnalyzer = new Mock<IRiskAnalyzer>();
        _mockLogger = new Mock<ILogger<MLNetFraudDetectionService>>();
    }

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
    public void Constructor_WithValidDependencies_Initializes()
    {
        _mockModelRepository.Setup(m => m.ModelExists()).Returns(false);

        var service = new MLNetFraudDetectionService(
            _mockModelRepository.Object,
            _mockRiskAnalyzer.Object,
            _mockLogger.Object);

        Assert.NotNull(service);
        Assert.Equal("MLNet", service.ServiceName);
        Assert.False(service.IsModelLoaded);
    }

    [Fact]
    public void Constructor_WithNullModelRepository_ThrowsException()
    {
        var exception = Assert.Throws<ArgumentNullException>(() =>
            new MLNetFraudDetectionService(
                null,
                _mockRiskAnalyzer.Object,
                _mockLogger.Object));

        Assert.Contains("modelRepository", exception.Message);
    }

    [Fact]
    public void Constructor_WithNullRiskAnalyzer_ThrowsException()
    {
        var exception = Assert.Throws<ArgumentNullException>(() =>
            new MLNetFraudDetectionService(
                _mockModelRepository.Object,
                null,
                _mockLogger.Object));

        Assert.Contains("riskAnalyzer", exception.Message);
    }

    [Fact]
    public void Constructor_WithNullLogger_ThrowsException()
    {
        var exception = Assert.Throws<ArgumentNullException>(() =>
            new MLNetFraudDetectionService(
                _mockModelRepository.Object,
                _mockRiskAnalyzer.Object,
                null));

        Assert.Contains("logger", exception.Message);
    }

    [Fact]
    public void Constructor_WhenModelExists_LoadsModel()
    {
        _mockModelRepository.Setup(m => m.ModelExists()).Returns(true);
        var mockModel = new Mock<Microsoft.ML.ITransformer>();
        _mockModelRepository.Setup(m => m.LoadModel(out It.Ref<Microsoft.ML.DataViewSchema>.IsAny))
            .Returns(mockModel.Object);

        var service = new MLNetFraudDetectionService(
            _mockModelRepository.Object,
            _mockRiskAnalyzer.Object,
            _mockLogger.Object);

        Assert.True(service.IsModelLoaded);
        _mockModelRepository.Verify(m => m.LoadModel(out It.Ref<Microsoft.ML.DataViewSchema>.IsAny), Times.Once);
    }

    [Fact]
    public async Task PredictAsync_WithoutModel_ThrowsException()
    {
        _mockModelRepository.Setup(m => m.ModelExists()).Returns(false);
        var service = new MLNetFraudDetectionService(
            _mockModelRepository.Object,
            _mockRiskAnalyzer.Object,
            _mockLogger.Object);

        var transaction = CreateTestTransaction();

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.PredictAsync(transaction));

        Assert.Contains("Model not loaded", exception.Message);
    }

    [Fact]
    public void ServiceName_ReturnsMLNet()
    {
        _mockModelRepository.Setup(m => m.ModelExists()).Returns(false);
        var service = new MLNetFraudDetectionService(
            _mockModelRepository.Object,
            _mockRiskAnalyzer.Object,
            _mockLogger.Object);

        Assert.Equal("MLNet", service.ServiceName);
    }

    [Fact]
    public void IsModelLoaded_WhenNoModel_ReturnsFalse()
    {
        _mockModelRepository.Setup(m => m.ModelExists()).Returns(false);
        var service = new MLNetFraudDetectionService(
            _mockModelRepository.Object,
            _mockRiskAnalyzer.Object,
            _mockLogger.Object);

        Assert.False(service.IsModelLoaded);
    }

    [Fact]
    public void IsModelLoaded_WhenModelLoaded_ReturnsTrue()
    {
        _mockModelRepository.Setup(m => m.ModelExists()).Returns(true);
        var mockModel = new Mock<Microsoft.ML.ITransformer>();
        _mockModelRepository.Setup(m => m.LoadModel(out It.Ref<Microsoft.ML.DataViewSchema>.IsAny))
            .Returns(mockModel.Object);

        var service = new MLNetFraudDetectionService(
            _mockModelRepository.Object,
            _mockRiskAnalyzer.Object,
            _mockLogger.Object);

        Assert.True(service.IsModelLoaded);
    }
}

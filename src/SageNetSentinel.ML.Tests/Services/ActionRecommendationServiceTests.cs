using Xunit;

using SageNetSentinel.ML.Services;
using SageNetSentinel.Contracts.Constants;

namespace SageNetSentinel.ML.Tests.Services;

public class ActionRecommendationServiceTests
{
    [Theory]
    [InlineData(0.95f, "Decline")]
    [InlineData(0.8f, "Decline")]
    [InlineData(0.79f, "Review")]
    [InlineData(0.5f, "Review")]
    [InlineData(0.49f, "Approve")]
    [InlineData(0.2f, "Approve")]
    [InlineData(0f, "Approve")]
    public void DetermineAction_BasedOnProbability_ReturnsCorrectAction(float probability, string expectedAction)
    {
        var action = ActionRecommendationService.DetermineAction(probability);

        Assert.Equal(expectedAction, action);
    }

    [Theory]
    [InlineData(0.85f, 0.9f, true, "Decline")]
    [InlineData(0.8f, 0.8f, true, "Decline")]
    [InlineData(0.75f, 0.7f, false, "Review")]
    [InlineData(0.6f, 0.5f, false, "Review")]
    [InlineData(0.45f, 0.4f, true, "Review")]
    [InlineData(0.3f, 0.2f, false, "Approve")]
    public void DetermineEnsembleAction_ConsidersConfidenceAndAgreement(
        float probability, float confidence, bool modelsAgree, string expectedAction)
    {
        var action = ActionRecommendationService.DetermineEnsembleAction(probability, confidence, modelsAgree);

        Assert.Equal(expectedAction, action);
    }

    [Fact]
    public void DetermineEnsembleAction_HighProbabilityHighConfidenceAgreement_Declines()
    {
        var action = ActionRecommendationService.DetermineEnsembleAction(0.9f, 0.95f, true);

        Assert.Equal("Decline", action);
    }

    [Fact]
    public void DetermineEnsembleAction_HighProbabilityHighConfidenceDisagreement_Reviews()
    {
        var action = ActionRecommendationService.DetermineEnsembleAction(0.9f, 0.95f, false);

        // When models disagree even with high probability, should review
        Assert.NotEqual("Decline", action);
    }

    [Fact]
    public void DetermineEnsembleAction_LowConfidenceModerateRisk_Reviews()
    {
        var action = ActionRecommendationService.DetermineEnsembleAction(
            FraudDetectionConstants.Thresholds.ModerateRisk,
            FraudDetectionConstants.Thresholds.LowConfidence,
            false);

        Assert.Equal("Review", action);
    }

    [Fact]
    public void DetermineAction_BoundaryAtStandardFraud()
    {
        var actionJustBelow = ActionRecommendationService.DetermineAction(
            FraudDetectionConstants.Thresholds.StandardFraud - 0.01f);
        var actionAtThreshold = ActionRecommendationService.DetermineAction(
            FraudDetectionConstants.Thresholds.StandardFraud);

        Assert.Equal("Review", actionJustBelow);
        Assert.Equal("Decline", actionAtThreshold);
    }

    [Fact]
    public void DetermineAction_BoundaryAtReviewRequired()
    {
        var actionJustBelow = ActionRecommendationService.DetermineAction(
            FraudDetectionConstants.Thresholds.ReviewRequired - 0.01f);
        var actionAtThreshold = ActionRecommendationService.DetermineAction(
            FraudDetectionConstants.Thresholds.ReviewRequired);

        Assert.Equal("Approve", actionJustBelow);
        Assert.Equal("Review", actionAtThreshold);
    }

    [Theory]
    [InlineData(1f)]
    [InlineData(0.5f)]
    [InlineData(0f)]
    public void DetermineAction_WithValidProbabilities_NeverReturnsNull(float probability)
    {
        var action = ActionRecommendationService.DetermineAction(probability);

        Assert.NotNull(action);
        Assert.NotEmpty(action);
        Assert.True(action == "Approve" || action == "Review" || action == "Decline");
    }
}

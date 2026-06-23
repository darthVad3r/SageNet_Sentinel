# Getting Started with SageNetSentinel

## Prerequisites

- .NET 9.0 SDK
- Visual Studio 2022 or VS Code
- (Optional) AWS Account for SageMaker integration

## Step 1: Train Your First Model

Before you can detect fraud, you need to train a model. Use the provided sample data:

```bash
cd src/SageNetSentinel.Api
dotnet run
```

Once the API is running, train a model using curl or any API client:

```bash
curl -X POST https://localhost:5001/api/ModelManagement/train \
  -H "Content-Type: application/json" \
  -d '{
    "dataSourcePath": "../../sample_data/training_data.csv",
    "modelType": "BinaryClassification",
    "maxTrainingTimeSeconds": 60
  }'
```

## Step 2: Test Fraud Detection

### Test with a legitimate transaction:

```bash
curl -X POST https://localhost:5001/api/FraudDetection/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "transactionId": "TEST001",
      "amount": 45.99,
      "merchantName": "Local Coffee Shop",
      "merchantCategory": "Food",
      "location": "Seattle, WA",
      "country": "USA",
      "timestamp": "2025-11-30T10:30:00Z",
      "userId": "USER123",
      "cardLastFour": "4532",
      "transactionType": "in-store",
      "timeSinceLastTransaction": 240,
      "transactionCountLast24Hours": 3,
      "amountSpentLast24Hours": 120.50,
      "isInternational": false,
      "isHighRiskMerchant": false
    }
  }'
```

Expected result: `"isFraudulent": false`, `"recommendedAction": "Approve"`

### Test with a suspicious transaction:

```bash
curl -X POST https://localhost:5001/api/FraudDetection/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "transactionId": "TEST002",
      "amount": 3500.00,
      "merchantName": "Overseas Electronics",
      "merchantCategory": "Electronics",
      "location": "Hong Kong",
      "country": "China",
      "timestamp": "2025-11-30T03:15:00Z",
      "userId": "USER123",
      "cardLastFour": "4532",
      "transactionType": "online",
      "distanceFromLastTransaction": 8000,
      "timeSinceLastTransaction": 15,
      "transactionCountLast24Hours": 12,
      "amountSpentLast24Hours": 9500.00,
      "isInternational": true,
      "isHighRiskMerchant": true
    }
  }'
```

Expected result: `"isFraudulent": true`, `"recommendedAction": "Decline"` or `"Review"`

## Step 3: Explore the API

Open your browser to `https://localhost:5001/swagger` to see all available endpoints and test them interactively.

## Step 4: (Optional) Configure AWS SageMaker

If you want to use AWS SageMaker for production-grade ML:

1. Create an AWS account and set up SageMaker
2. Create an S3 bucket for training data
3. Create an IAM role with SageMaker permissions
4. Update `appsettings.json`:

```json
{
  "SageMaker": {
    "Enabled": true,
    "EndpointName": "your-endpoint-name",
    "RoleArn": "arn:aws:iam::123456789:role/SageMakerRole",
    "S3BucketName": "your-bucket-name",
    "AwsRegion": "us-west-2"
  }
}
```

5. Configure AWS credentials using AWS CLI or environment variables

## Tuning False Positive Reduction

Edit `appsettings.json` to adjust sensitivity:

- **Lower false positives** (more conservative): Increase `DisagreementThreshold` to 0.8
- **Higher fraud detection** (more aggressive): Decrease `FraudThreshold` to 0.4
- **More manual reviews**: Increase `MinimumConfidenceForAutoDecision` to 0.6

## Production Deployment

1. **Add authentication**: Implement JWT or API key authentication
2. **Configure logging**: Use Serilog or Application Insights
3. **Add rate limiting**: Protect against abuse
4. **Database integration**: Store predictions and feedback for model improvement
5. **Containerize**: Use Docker for consistent deployment
6. **Monitor**: Set up health checks and alerting

## Next Steps

- Review `README_IMPLEMENTATION.md` for detailed architecture
- Train with your own transaction data
- Integrate with your payment processing system
- Set up continuous model retraining pipeline

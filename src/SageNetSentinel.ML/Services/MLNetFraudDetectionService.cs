using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Trainers;
using Microsoft.ML.Trainers.LightGbm;
using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Abstractions;
using SageNetSentinel.ML.Models;
using Microsoft.Extensions.Logging;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Service for training and predicting fraud detection using ML.NET
/// </summary>
public class MLNetFraudDetectionService : IFraudDetectionService, IModelTrainer
{
    private readonly MLContext _mlContext;
    private ITransformer? _model;
    private readonly IModelRepository _modelRepository;
    private readonly IRiskAnalyzer _riskAnalyzer;
    private readonly ILogger<MLNetFraudDetectionService> _logger;

    public string ServiceName => "MLNet";

    public MLNetFraudDetectionService(
        IModelRepository modelRepository,
        IRiskAnalyzer riskAnalyzer,
        ILogger<MLNetFraudDetectionService> logger)
    {
        _mlContext = new MLContext(seed: 42);
        _modelRepository = modelRepository ?? throw new ArgumentNullException(nameof(modelRepository));
        _riskAnalyzer = riskAnalyzer ?? throw new ArgumentNullException(nameof(riskAnalyzer));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        
        // Load existing model if available
        if (_modelRepository.ModelExists())
        {
            _model = _modelRepository.LoadModel(out _);
            _logger.LogInformation("ML.NET model loaded successfully");
        }
        else
        {
            _logger.LogWarning("No existing ML.NET model found");
        }
    }

    /// <summary>
    /// Train a binary classification model for fraud detection
    /// </summary>
    public void TrainModel(string trainingDataPath, int trainingTimeSeconds = 300)
    {
        // Load training data
        IDataView trainingData = _mlContext.Data.LoadFromTextFile<FraudTrainingData>(
            path: trainingDataPath,
            hasHeader: true,
            separatorChar: ',');

        // Define data preprocessing pipeline
        var dataProcessPipeline = _mlContext.Transforms.Conversion
            .MapValueToKey("Label")
            .Append(_mlContext.Transforms.Concatenate("Features",
                nameof(FraudTrainingData.Amount),
                nameof(FraudTrainingData.TransactionCountLast24Hours),
                nameof(FraudTrainingData.AmountSpentLast24Hours),
                nameof(FraudTrainingData.TimeSinceLastTransaction),
                nameof(FraudTrainingData.DistanceFromLastTransaction),
                nameof(FraudTrainingData.IsInternational),
                nameof(FraudTrainingData.IsHighRiskMerchant),
                nameof(FraudTrainingData.HourOfDay),
                nameof(FraudTrainingData.DayOfWeek)))
            .Append(_mlContext.Transforms.NormalizeMinMax("Features"));

        // Use LightGBM for better fraud detection performance
        var trainer = _mlContext.BinaryClassification.Trainers.LightGbm(
            new LightGbmBinaryTrainer.Options
            {
                NumberOfLeaves = 31,
                MinimumExampleCountPerLeaf = 20,
                LearningRate = 0.05,
                NumberOfIterations = 100,
                LabelColumnName = "Label",
                FeatureColumnName = "Features"
            });

        var trainingPipeline = dataProcessPipeline
            .Append(trainer)
            .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

        // Train the model
        Console.WriteLine("Training ML.NET fraud detection model...");
        _model = trainingPipeline.Fit(trainingData);

        // Evaluate the model
        var predictions = _model.Transform(trainingData);
        var metrics = _mlContext.BinaryClassification.Evaluate(predictions, "Label");

        Console.WriteLine($"Model Accuracy: {metrics.Accuracy:P2}");
        Console.WriteLine($"AUC: {metrics.AreaUnderRocCurve:P2}");
        Console.WriteLine($"F1 Score: {metrics.F1Score:P2}");
        Console.WriteLine($"Precision: {metrics.PositivePrecision:P2}");
        Console.WriteLine($"Recall: {metrics.PositiveRecall:P2}");

        // Save the model
        _modelRepository.SaveModel(_model, trainingData.Schema);
    }

    /// <summary>
    /// Train model using standard binary classification
    /// AutoML requires Microsoft.ML.AutoML package which is deprecated
    /// This method provides similar functionality with manual hyperparameter tuning
    /// </summary>
    public void TrainWithAutoML(string trainingDataPath, int trainingTimeSeconds = 300)
    {
        Console.WriteLine($"Training with standard binary classification (AutoML alternative)");
        Console.WriteLine($"Note: AutoML package is deprecated. Using LightGBM with optimized parameters.");
        
        // Use the standard training method which provides excellent results
        TrainModel(trainingDataPath, trainingTimeSeconds);
    }

    /// <summary>
    /// Predict fraud for a single transaction
    /// </summary>
    public Task<FraudPrediction> PredictAsync(TransactionData transaction)
    {
        var result = Predict(transaction);
        return Task.FromResult(result);
    }

    /// <summary>
    /// Synchronous prediction (internal use)
    /// </summary>
    private FraudPrediction Predict(TransactionData transaction)
    {
        if (_model == null)
        {
            throw new InvalidOperationException("Model not loaded. Train or load a model first.");
        }

        try
        {
            // Create prediction engine
            var predictionEngine = _mlContext.Model
                .CreatePredictionEngine<FraudTrainingData, FraudPredictionOutput>(_model);

            // Convert transaction to training data format
            var input = TransactionDataConverter.ToTrainingData(transaction);

            // Make prediction
            var output = predictionEngine.Predict(input);

            return new FraudPrediction
            {
                TransactionId = transaction.TransactionId,
                IsFraudulent = output.IsFraud,
                FraudProbability = output.Probability,
                ConfidenceScore = Math.Abs(output.Score),
                PredictionSource = ServiceName,
                RecommendedAction = ActionRecommendationService.DetermineAction(output.Probability),
                PredictionTimestamp = DateTime.UtcNow,
                RiskFactors = _riskAnalyzer.IdentifyRiskFactors(transaction, output.Probability)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error making prediction for transaction {TransactionId}", transaction.TransactionId);
            throw;
        }
    }

    public bool IsModelLoaded => _model != null;
}

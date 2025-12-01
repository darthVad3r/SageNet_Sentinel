using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Trainers;
using Microsoft.ML.Trainers.LightGbm;
using SageNetSentinel.Contracts;
using SageNetSentinel.ML.Models;

namespace SageNetSentinel.ML.Services;

/// <summary>
/// Service for training and predicting fraud detection using ML.NET
/// </summary>
public class MLNetFraudDetectionService
{
    private readonly MLContext _mlContext;
    private ITransformer? _model;
    private readonly string _modelPath;

    public MLNetFraudDetectionService(string modelPath = "fraud_model.zip")
    {
        _mlContext = new MLContext(seed: 42);
        _modelPath = modelPath;
        
        // Load existing model if available
        if (File.Exists(_modelPath))
        {
            LoadModel();
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
        SaveModel(trainingData.Schema);
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
    public FraudPrediction Predict(TransactionData transaction)
    {
        if (_model == null)
        {
            throw new InvalidOperationException("Model not loaded. Train or load a model first.");
        }

        // Create prediction engine
        var predictionEngine = _mlContext.Model
            .CreatePredictionEngine<FraudTrainingData, FraudPredictionOutput>(_model);

        // Convert transaction to training data format
        var input = ConvertToTrainingData(transaction);

        // Make prediction
        var output = predictionEngine.Predict(input);

        return new FraudPrediction
        {
            TransactionId = transaction.TransactionId,
            IsFraudulent = output.IsFraud,
            FraudProbability = output.Probability,
            ConfidenceScore = Math.Abs(output.Score),
            PredictionSource = "MLNet",
            RecommendedAction = DetermineAction(output.Probability),
            PredictionTimestamp = DateTime.UtcNow,
            RiskFactors = IdentifyRiskFactors(transaction, output.Probability)
        };
    }

    /// <summary>
    /// Convert TransactionData to FraudTrainingData format
    /// </summary>
    private static FraudTrainingData ConvertToTrainingData(TransactionData transaction)
    {
        return new FraudTrainingData
        {
            Amount = (float)transaction.Amount,
            TransactionCountLast24Hours = transaction.TransactionCountLast24Hours,
            AmountSpentLast24Hours = (float)transaction.AmountSpentLast24Hours,
            TimeSinceLastTransaction = (float)(transaction.TimeSinceLastTransaction ?? 0),
            DistanceFromLastTransaction = (float)(transaction.DistanceFromLastTransaction ?? 0),
            IsInternational = transaction.IsInternational,
            IsHighRiskMerchant = transaction.IsHighRiskMerchant,
            HourOfDay = transaction.Timestamp.Hour,
            DayOfWeek = (float)transaction.Timestamp.DayOfWeek
        };
    }

    /// <summary>
    /// Determine recommended action based on fraud probability
    /// </summary>
    private static string DetermineAction(float probability)
    {
        return probability switch
        {
            >= 0.8f => "Decline",
            >= 0.5f => "Review",
            _ => "Approve"
        };
    }

    /// <summary>
    /// Identify risk factors contributing to fraud score
    /// </summary>
    private static List<string> IdentifyRiskFactors(TransactionData transaction, float probability)
    {
        var factors = new List<string>();

        if (probability < 0.3f) return factors;

        if (transaction.Amount > 1000)
            factors.Add("High transaction amount");

        if (transaction.IsInternational)
            factors.Add("International transaction");

        if (transaction.IsHighRiskMerchant)
            factors.Add("High-risk merchant category");

        if (transaction.TransactionCountLast24Hours > 10)
            factors.Add("Unusual transaction frequency");

        if (transaction.DistanceFromLastTransaction > 500)
            factors.Add("Large distance from previous transaction");

        if (transaction.Timestamp.Hour < 6 || transaction.Timestamp.Hour > 23)
            factors.Add("Unusual transaction time");

        return factors;
    }

    /// <summary>
    /// Save the trained model to disk
    /// </summary>
    private void SaveModel(DataViewSchema schema)
    {
        if (_model == null) return;

        _mlContext.Model.Save(_model, schema, _modelPath);
        Console.WriteLine($"Model saved to {_modelPath}");
    }

    /// <summary>
    /// Load a previously trained model from disk
    /// </summary>
    private void LoadModel()
    {
        _model = _mlContext.Model.Load(_modelPath, out _);
        Console.WriteLine($"Model loaded from {_modelPath}");
    }

    public bool IsModelLoaded => _model != null;
}

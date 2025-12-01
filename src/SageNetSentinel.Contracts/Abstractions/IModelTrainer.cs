namespace SageNetSentinel.ML.Abstractions;

/// <summary>
/// Interface for model training operations
/// </summary>
public interface IModelTrainer
{
    /// <summary>
    /// Train a model with the specified training data
    /// </summary>
    void TrainModel(string trainingDataPath, int trainingTimeSeconds = 300);
    
    /// <summary>
    /// Check if a trained model is loaded and ready
    /// </summary>
    bool IsModelLoaded { get; }
}

namespace SageNetSentinel.Core.Abstractions;

public interface IModelTrainer
{
    void TrainModel(string trainingDataPath, int trainingTimeSeconds = 300);
    void TrainWithAutoML(string trainingDataPath, int trainingTimeSeconds = 300);
    bool IsModelLoaded { get; }
}

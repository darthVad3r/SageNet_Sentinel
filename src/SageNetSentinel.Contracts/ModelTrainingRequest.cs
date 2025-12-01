namespace SageNetSentinel.Contracts;

/// <summary>
/// Request to trigger model training
/// </summary>
public class ModelTrainingRequest
{
    public string DataSourcePath { get; set; } = string.Empty;
    public string ModelType { get; set; } = "BinaryClassification"; // BinaryClassification, AutoML
    public int MaxTrainingTimeSeconds { get; set; } = 300;
    public bool UseSageMaker { get; set; } = false;
    public Dictionary<string, string> HyperParameters { get; set; } = new();
}

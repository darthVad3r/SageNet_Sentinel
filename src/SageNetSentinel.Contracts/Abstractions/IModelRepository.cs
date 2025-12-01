using Microsoft.ML;

namespace SageNetSentinel.ML.Abstractions;

/// <summary>
/// Interface for model persistence operations
/// </summary>
public interface IModelRepository
{
    /// <summary>
    /// Save a trained model
    /// </summary>
    void SaveModel(ITransformer model, DataViewSchema schema);
    
    /// <summary>
    /// Load a trained model
    /// </summary>
    ITransformer? LoadModel(out DataViewSchema schema);
    
    /// <summary>
    /// Check if a model exists
    /// </summary>
    bool ModelExists();
}

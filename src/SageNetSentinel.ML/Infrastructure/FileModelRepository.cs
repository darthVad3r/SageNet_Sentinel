using Microsoft.ML;
using Microsoft.ML.Data;

namespace SageNetSentinel.ML.Infrastructure;

/// <summary>
/// File-based model repository implementation
/// </summary>
public class FileModelRepository : ML.Abstractions.IModelRepository
{
    private readonly MLContext _mlContext;
    private readonly string _modelPath;

    public FileModelRepository(MLContext mlContext, string modelPath)
    {
        _mlContext = mlContext ?? throw new ArgumentNullException(nameof(mlContext));
        _modelPath = modelPath ?? throw new ArgumentNullException(nameof(modelPath));
    }

    public void SaveModel(ITransformer model, DataViewSchema schema)
    {
        if (model == null) throw new ArgumentNullException(nameof(model));
        if (schema == null) throw new ArgumentNullException(nameof(schema));

        _mlContext.Model.Save(model, schema, _modelPath);
        Console.WriteLine($"Model saved to {_modelPath}");
    }

    public ITransformer? LoadModel(out DataViewSchema schema)
    {
        if (!File.Exists(_modelPath))
        {
            schema = null!;
            return null;
        }

        var model = _mlContext.Model.Load(_modelPath, out schema);
        Console.WriteLine($"Model loaded from {_modelPath}");
        return model;
    }

    public bool ModelExists()
    {
        return File.Exists(_modelPath);
    }
}

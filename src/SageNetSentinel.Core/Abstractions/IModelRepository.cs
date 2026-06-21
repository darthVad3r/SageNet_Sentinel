using Microsoft.ML;

namespace SageNetSentinel.Core.Abstractions;

public interface IModelRepository
{
    void SaveModel(ITransformer model, DataViewSchema schema);
    ITransformer? LoadModel(out DataViewSchema schema);
    bool ModelExists();
}

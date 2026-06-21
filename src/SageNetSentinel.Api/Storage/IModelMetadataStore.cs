using SageNetSentinel.Api.Models;

namespace SageNetSentinel.Api.Storage;

public interface IModelMetadataStore
{
    IReadOnlyCollection<ModelMetadata> GetModels();
}

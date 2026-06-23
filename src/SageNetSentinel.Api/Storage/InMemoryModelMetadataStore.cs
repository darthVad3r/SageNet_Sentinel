using SageNetSentinel.Api.Models;

namespace SageNetSentinel.Api.Storage;

public class InMemoryModelMetadataStore : IModelMetadataStore
{
    public IReadOnlyCollection<ModelMetadata> GetModels()
    {
        return
        [
            new ModelMetadata { Name = "MLNet", Version = "1.0.0" },
            new ModelMetadata { Name = "SageMaker", Version = "placeholder" }
        ];
    }
}

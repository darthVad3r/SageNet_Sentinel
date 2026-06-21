namespace SageNetSentinel.Api.Storage;

public class InMemoryModelMetadataStore : IModelMetadataStore
{
    public IReadOnlyCollection<object> GetModels()
    {
        return
        [
            new { name = "MLNet", version = "1.0.0" },
            new { name = "SageMaker", version = "placeholder" }
        ];
    }
}

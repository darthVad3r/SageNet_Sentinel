namespace SageNetSentinel.Api.Storage;

public interface IModelMetadataStore
{
    IReadOnlyCollection<object> GetModels();
}

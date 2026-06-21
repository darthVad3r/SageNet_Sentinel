namespace SageNetSentinel.Kinesis.Services;

public interface IKinesisConsumerHealth
{
    bool IsHealthy { get; }
    string StatusMessage { get; }
}

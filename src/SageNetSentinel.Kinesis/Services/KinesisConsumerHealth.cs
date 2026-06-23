namespace SageNetSentinel.Kinesis.Services;

public class KinesisConsumerHealth : IKinesisConsumerHealth
{
    public bool IsHealthy { get; private set; } = true;
    public string StatusMessage { get; private set; } = "Kinesis consumer initialized";

    public void MarkHealthy(string message = "Kinesis consumer running")
    {
        IsHealthy = true;
        StatusMessage = message;
    }

    public void MarkUnhealthy(string message)
    {
        IsHealthy = false;
        StatusMessage = message;
    }
}

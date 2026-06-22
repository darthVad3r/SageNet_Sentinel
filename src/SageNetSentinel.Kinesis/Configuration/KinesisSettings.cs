namespace SageNetSentinel.Kinesis.Configuration;

public class KinesisSettings
{
    public string StreamName { get; set; } = "sagenet-transactions";
    public int BatchSize { get; set; } = 25;
    public int PollIntervalSeconds { get; set; } = 5;
    public bool Enabled { get; set; } = false;
}

namespace TagAnalyzer.Api.Models;

public class TagInfo
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string ResourceType { get; set; } = string.Empty; // "ResourceGroup" or "Resource"
    public string ResourceName { get; set; } = string.Empty;
    public string ResourceGroupName { get; set; } = string.Empty;
    public string SubscriptionId { get; set; } = string.Empty;
    public string SubscriptionName { get; set; } = string.Empty;
}

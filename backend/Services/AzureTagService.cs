using Azure.Core;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.Resources;
using TagAnalyzer.Api.Models;

namespace TagAnalyzer.Api.Services;

public class AzureTagService
{
    private readonly ILogger<AzureTagService> _logger;
    private readonly ArmClient _armClient;

    public AzureTagService(ILogger<AzureTagService> logger)
    {
        _logger = logger;
        // Use DefaultAzureCredential for authentication
        // This will work with Azure CLI, Managed Identity, Environment Variables, etc.
        _armClient = new ArmClient(new DefaultAzureCredential());
    }

    public async Task<List<SubscriptionInfo>> GetSubscriptionsAsync()
    {
        var subscriptions = new List<SubscriptionInfo>();
        
        try
        {
            await foreach (var subscription in _armClient.GetSubscriptions().GetAllAsync())
            {
                subscriptions.Add(new SubscriptionInfo
                {
                    SubscriptionId = subscription.Data.SubscriptionId ?? string.Empty,
                    SubscriptionName = subscription.Data.DisplayName ?? string.Empty
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching subscriptions");
            throw;
        }

        return subscriptions;
    }

    public async Task<List<TagInfo>> GetAllTagsAsync()
    {
        var allTags = new List<TagInfo>();

        try
        {
            await foreach (var subscription in _armClient.GetSubscriptions().GetAllAsync())
            {
                var subscriptionId = subscription.Data.SubscriptionId ?? string.Empty;
                var subscriptionName = subscription.Data.DisplayName ?? string.Empty;

                _logger.LogInformation("Fetching tags from subscription: {SubscriptionName}", subscriptionName);

                // Get tags from resource groups
                await foreach (var resourceGroup in subscription.GetResourceGroups().GetAllAsync())
                {
                    var rgName = resourceGroup.Data.Name;

                    if (resourceGroup.Data.Tags != null)
                    {
                        foreach (var tag in resourceGroup.Data.Tags)
                        {
                            allTags.Add(new TagInfo
                            {
                                Key = tag.Key,
                                Value = tag.Value,
                                ResourceType = "ResourceGroup",
                                ResourceName = rgName,
                                ResourceGroupName = rgName,
                                SubscriptionId = subscriptionId,
                                SubscriptionName = subscriptionName
                            });
                        }
                    }

                    // Get tags from resources within the resource group
                    try
                    {
                        foreach (var resource in resourceGroup.GetGenericResources())
                        {
                            if (resource.Data.Tags != null)
                            {
                                foreach (var tag in resource.Data.Tags)
                                {
                                    allTags.Add(new TagInfo
                                    {
                                        Key = tag.Key,
                                        Value = tag.Value,
                                        ResourceType = resource.Data.ResourceType.ToString(),
                                        ResourceName = resource.Data.Name,
                                        ResourceGroupName = rgName,
                                        SubscriptionId = subscriptionId,
                                        SubscriptionName = subscriptionName
                                    });
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Error fetching resources from resource group: {ResourceGroup}", rgName);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching tags");
            throw;
        }

        return allTags;
    }

    public async Task<List<TagInfo>> SearchTagsAsync(string? tagKey, string? tagValue)
    {
        var allTags = await GetAllTagsAsync();

        // Filter tags based on search criteria
        var filteredTags = allTags.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(tagKey))
        {
            filteredTags = filteredTags.Where(t => 
                t.Key.Contains(tagKey, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(tagValue))
        {
            filteredTags = filteredTags.Where(t => 
                t.Value.Contains(tagValue, StringComparison.OrdinalIgnoreCase));
        }

        return filteredTags.ToList();
    }
}

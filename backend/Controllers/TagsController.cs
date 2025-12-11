using Microsoft.AspNetCore.Mvc;
using TagAnalyzer.Api.Models;
using TagAnalyzer.Api.Services;

namespace TagAnalyzer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly AzureTagService _tagService;
    private readonly ILogger<TagsController> _logger;

    public TagsController(AzureTagService tagService, ILogger<TagsController> logger)
    {
        _tagService = tagService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<TagInfo>>> GetAllTags()
    {
        try
        {
            _logger.LogInformation("Fetching all tags");
            var tags = await _tagService.GetAllTagsAsync();
            return Ok(tags);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching tags");
            return StatusCode(500, new { error = "Error fetching tags", message = ex.Message });
        }
    }

    [HttpPost("search")]
    public async Task<ActionResult<List<TagInfo>>> SearchTags([FromBody] TagSearchRequest request)
    {
        try
        {
            _logger.LogInformation("Searching tags with key: {TagKey}, value: {TagValue}", 
                request.TagKey, request.TagValue);
            var tags = await _tagService.SearchTagsAsync(request.TagKey, request.TagValue);
            return Ok(tags);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching tags");
            return StatusCode(500, new { error = "Error searching tags", message = ex.Message });
        }
    }

    [HttpGet("subscriptions")]
    public async Task<ActionResult<List<SubscriptionInfo>>> GetSubscriptions()
    {
        try
        {
            _logger.LogInformation("Fetching subscriptions");
            var subscriptions = await _tagService.GetSubscriptionsAsync();
            return Ok(subscriptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching subscriptions");
            return StatusCode(500, new { error = "Error fetching subscriptions", message = ex.Message });
        }
    }
}

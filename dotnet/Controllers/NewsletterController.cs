using Microsoft.AspNetCore.Mvc;
using OldCountyTimes.Models;
using OldCountyTimes.Services;

namespace OldCountyTimes.Controllers;

[ApiController]
[Route("api")]
public class NewsletterController : ControllerBase
{
    private readonly NewsletterUpdateService _newsletterService;

    public NewsletterController(NewsletterUpdateService newsletterService)
    {
        _newsletterService = newsletterService;
    }

    [HttpGet("newsletter-data")]
    public ActionResult<NewsletterData> GetNewsletterData()
    {
        return Ok(_newsletterService.CurrentData);
    }
}
using OldCountyTimes.Models;

namespace OldCountyTimes.Services;

public class NewsletterUpdateService : BackgroundService
{
    private readonly ContentGeneratorService _contentGenerator;
    private readonly ILogger<NewsletterUpdateService> _logger;
    
    public NewsletterData CurrentData { get; private set; }

    public NewsletterUpdateService(ContentGeneratorService contentGenerator, ILogger<NewsletterUpdateService> logger)
    {
        _contentGenerator = contentGenerator;
        _logger = logger;
        CurrentData = _contentGenerator.GenerateNewsletterData();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Newsletter update service started");
        
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            
            if (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Generating new newsletter content...");
                CurrentData = _contentGenerator.GenerateNewsletterData();
            }
        }
    }
}
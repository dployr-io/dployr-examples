using OldCountyTimes.Models;

namespace OldCountyTimes.Services;

public class ContentGeneratorService
{
    private readonly List<string> _mainArticleTitles = new()
    {
        "The monthly meeting rocked",
        "Quarterly review exceeds expectations",
        "Team building event brings everyone together",
        "New office policies announced",
        "Company picnic scheduled for next month"
    };

    private readonly List<string> _mainArticleContents = new()
    {
        "As with (almost) every last Friday of the month, we had our typical monthly meeting with the entire team. We received the sad news that, this month, the sales target — probably — will not be met. It was also announced that our 30th branch will open next month. Our CEO announced that with the arrival of the 50 new employees, the amount of coffee consumed increased slightly.",
        "The quarterly numbers are in and they show remarkable progress across all departments. Employee satisfaction surveys indicate a 15% improvement over last quarter. The new coffee machine in the break room has been particularly well-received by the team.",
        "Last Friday's team building activities brought together employees from all departments for a day of collaboration and fun. The escape room challenge was won by the marketing team, while the accounting department dominated the trivia contest.",
        "Management has announced several new policies aimed at improving work-life balance. The new flexible working hours policy will take effect next month, along with the introduction of casual Fridays.",
        "Save the date! Our annual company picnic has been scheduled for the last Saturday of next month. There will be games, food, and prizes for the whole family. RSVP deadline is two weeks from today."
    };

    private readonly List<string> _leftColumnTitles = new()
    {
        "\"We want broccoli pie!\"",
        "\"Coffee machine needs fixing!\"",
        "\"More parking spaces needed!\"",
        "\"Bring back pizza Fridays!\"",
        "\"Office temperature too cold!\""
    };

    private readonly List<string> _leftColumnContents = new()
    {
        "Popular outcry was not silenced. But the broccoli pie protest came to a sad end. Informants claim that the result of the party at the office last Friday (26) was not friendly at all. Instead of the broccoli pie, the delivery lady brought chicken pie. The team's vegans, who currently make up 95% of the people, were disappointed.",
        "The office coffee machine has been acting up again, producing what can only be described as 'brown water' instead of coffee. Facilities management has promised a replacement by next week, but employees remain skeptical.",
        "With the recent hiring spree, the parking lot has become a battleground. Employees are arriving earlier just to secure a spot. Management is considering renting additional spaces across the street.",
        "The beloved pizza Friday tradition was discontinued last month due to budget constraints. A petition with over 200 signatures has been submitted to management requesting its return.",
        "The ongoing thermostat wars continue as employees bundle up in winter coats while working. The facilities team claims the temperature is 'optimal,' but the evidence suggests otherwise."
    };

    private readonly List<Joke> _jokes = new()
    {
        new Joke
        {
            Setup = "At the cinema box office:",
            Lines = new List<string>
            {
                "— Two tickets, please.",
                "— Is it for Romeo and Juliet?",
                "— No, it's for me and my girlfriend."
            }
        },
        new Joke
        {
            Setup = "At the office printer:",
            Lines = new List<string>
            {
                "— Why won't this print?",
                "— Did you try turning it off and on?",
                "— Yes, my computer is working fine."
            }
        },
        new Joke
        {
            Setup = "In the break room:",
            Lines = new List<string>
            {
                "— Is the coffee fresh?",
                "— Define fresh.",
                "— Made this century?"
            }
        }
    };

    private readonly Random _random = new();

    public NewsletterData GenerateNewsletterData()
    {
        var mainArticle = new Article
        {
            Title = GetRandomItem(_mainArticleTitles),
            Content = GetRandomItem(_mainArticleContents),
            ImageCaption = $"Photo of the online call via Google Meet held on Friday, {GetRandomDate()}."
        };

        var leftColumn = new Column
        {
            Title = GetRandomItem(_leftColumnTitles),
            Content = GetRandomItem(_leftColumnContents)
        };

        var joke = GetRandomItem(_jokes);
        var rightColumn = new RightColumn
        {
            Title = "Joke of the month",
            Content = joke.Setup,
            JokeLines = joke.Lines,
            Note = "Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it)."
        };

        return new NewsletterData
        {
            Header = new Header
            {
                Edition = $"Edition nº {_random.Next(1, 101)}",
                Date = GetRandomDate()
            },
            Title = "Old County Times",
            MainArticle = mainArticle,
            LeftColumn = leftColumn,
            RightColumn = rightColumn,
            ComicSection = new ComicSection
            {
                Title = "Comic strip of the month",
                Caption = "Caption: Special thanks to Bia Franzoli for their amazing newspaper design inspiration"
            },
            ContributeSection = new ContributeSection
            {
                Title = "Contribute to Old County Times",
                Paragraphs = new List<string>
                {
                    "Tell us about everyday events at the company: we accept reports, images, jokes and whatever else your creativity allows. Share with us the achievements and defeats in your area so that we can always be together on this journey.",
                    "Note: All contributions will be selected and evaluated by a mediator before entering the next edition."
                }
            }
        };
    }

    private T GetRandomItem<T>(List<T> items)
    {
        return items[_random.Next(items.Count)];
    }

    private string GetRandomDate()
    {
        var days = new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" };
        var months = new[] { "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" };

        var day = GetRandomItem(days.ToList());
        var month = GetRandomItem(months.ToList());
        var date = _random.Next(1, 29);
        var year = 2014;

        return $"{day}, {month} {date}, {year}";
    }
}
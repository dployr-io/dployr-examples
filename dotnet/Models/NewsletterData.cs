namespace OldCountyTimes.Models;

public class NewsletterData
{
    public Header Header { get; set; } = new();
    public string Title { get; set; } = "Old County Times";
    public Article MainArticle { get; set; } = new();
    public Column LeftColumn { get; set; } = new();
    public RightColumn RightColumn { get; set; } = new();
    public ComicSection ComicSection { get; set; } = new();
    public ContributeSection ContributeSection { get; set; } = new();
}

public class Header
{
    public string Edition { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
}

public class Article
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string ImageCaption { get; set; } = string.Empty;
}

public class Column
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class RightColumn
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> JokeLines { get; set; } = new();
    public string Note { get; set; } = string.Empty;
}

public class ComicSection
{
    public string Title { get; set; } = string.Empty;
    public string Caption { get; set; } = string.Empty;
}

public class ContributeSection
{
    public string Title { get; set; } = string.Empty;
    public List<string> Paragraphs { get; set; } = new();
}

public class Joke
{
    public string Setup { get; set; } = string.Empty;
    public List<string> Lines { get; set; } = new();
}
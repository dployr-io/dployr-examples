package com.dployr.oldcountytimes.service;

import com.dployr.oldcountytimes.model.NewsletterData;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class ContentGenerator {
    private final Random random = new Random();
    
    private final List<String> mainArticleTitles = Arrays.asList(
        "The monthly meeting rocked",
        "Quarterly review exceeds expectations",
        "Team building event brings everyone together",
        "New office policies announced",
        "Company picnic scheduled for next month"
    );

    private final List<String> mainArticleContents = Arrays.asList(
        "As with (almost) every last Friday of the month, we had our typical monthly meeting with the entire team. We received the sad news that, this month, the sales target — probably — will not be met. It was also announced that our 30th branch will open next month. Our CEO announced that with the arrival of the 50 new employees, the amount of coffee consumed increased slightly.",
        "The quarterly numbers are in and they show remarkable progress across all departments. Employee satisfaction surveys indicate a 15% improvement over last quarter. The new coffee machine in the break room has been particularly well-received by the team.",
        "Last Friday's team building activities brought together employees from all departments for a day of collaboration and fun. The escape room challenge was won by the marketing team, while the accounting department dominated the trivia contest.",
        "Management has announced several new policies aimed at improving work-life balance. The new flexible working hours policy will take effect next month, along with the introduction of casual Fridays.",
        "Save the date! Our annual company picnic has been scheduled for the last Saturday of next month. There will be games, food, and prizes for the whole family. RSVP deadline is two weeks from today."
    );

    private final List<String> leftColumnTitles = Arrays.asList(
        "\"We want broccoli pie!\"",
        "\"Coffee machine needs fixing!\"",
        "\"More parking spaces needed!\"",
        "\"Bring back pizza Fridays!\"",
        "\"Office temperature too cold!\""
    );

    private final List<String> leftColumnContents = Arrays.asList(
        "Popular outcry was not silenced. But the broccoli pie protest came to a sad end. Informants claim that the result of the party at the office last Friday (26) was not friendly at all. Instead of the broccoli pie, the delivery lady brought chicken pie. The team's vegans, who currently make up 95% of the people, were disappointed.",
        "The office coffee machine has been acting up again, producing what can only be described as 'brown water' instead of coffee. Facilities management has promised a replacement by next week, but employees remain skeptical.",
        "With the recent hiring spree, the parking lot has become a battleground. Employees are arriving earlier just to secure a spot. Management is considering renting additional spaces across the street.",
        "The beloved pizza Friday tradition was discontinued last month due to budget constraints. A petition with over 200 signatures has been submitted to management requesting its return.",
        "The ongoing thermostat wars continue as employees bundle up in winter coats while working. The facilities team claims the temperature is 'optimal,' but the evidence suggests otherwise."
    );

    private final List<Joke> jokes = Arrays.asList(
        new Joke("At the cinema box office:", Arrays.asList(
            "— Two tickets, please.",
            "— Is it for Romeo and Juliet?",
            "— No, it's for me and my girlfriend."
        )),
        new Joke("At the office printer:", Arrays.asList(
            "— Why won't this print?",
            "— Did you try turning it off and on?",
            "— Yes, my computer is working fine."
        )),
        new Joke("In the break room:", Arrays.asList(
            "— Is the coffee fresh?",
            "— Define fresh.",
            "— Made this century?"
        ))
    );

    public NewsletterData generateNewsletterData() {
        NewsletterData data = new NewsletterData();
        
        // Header
        NewsletterData.Header header = new NewsletterData.Header();
        header.setEdition("Edition nº " + (random.nextInt(100) + 1));
        header.setDate(getRandomDate());
        data.setHeader(header);
        
        // Title
        data.setTitle("Old County Times");
        
        // Main Article
        NewsletterData.Article mainArticle = new NewsletterData.Article();
        mainArticle.setTitle(getRandomItem(mainArticleTitles));
        mainArticle.setContent(getRandomItem(mainArticleContents));
        mainArticle.setImageCaption("Photo of the online call via Google Meet held on Friday, " + getRandomDate() + ".");
        data.setMainArticle(mainArticle);
        
        // Left Column
        NewsletterData.Column leftColumn = new NewsletterData.Column();
        leftColumn.setTitle(getRandomItem(leftColumnTitles));
        leftColumn.setContent(getRandomItem(leftColumnContents));
        data.setLeftColumn(leftColumn);
        
        // Right Column
        Joke joke = getRandomItem(jokes);
        NewsletterData.RightColumn rightColumn = new NewsletterData.RightColumn();
        rightColumn.setTitle("Joke of the month");
        rightColumn.setContent(joke.getSetup());
        rightColumn.setJokeLines(joke.getLines());
        rightColumn.setNote("Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it).");
        data.setRightColumn(rightColumn);
        
        // Comic Section
        NewsletterData.ComicSection comicSection = new NewsletterData.ComicSection();
        comicSection.setTitle("Comic strip of the month");
        comicSection.setCaption("Caption: Special thanks to Bia Franzoli for their amazing newspaper design inspiration");
        data.setComicSection(comicSection);
        
        // Contribute Section
        NewsletterData.ContributeSection contributeSection = new NewsletterData.ContributeSection();
        contributeSection.setTitle("Contribute to Old County Times");
        contributeSection.setParagraphs(Arrays.asList(
            "Tell us about everyday events at the company: we accept reports, images, jokes and whatever else your creativity allows. Share with us the achievements and defeats in your area so that we can always be together on this journey.",
            "Note: All contributions will be selected and evaluated by a mediator before entering the next edition."
        ));
        data.setContributeSection(contributeSection);
        
        return data;
    }

    private <T> T getRandomItem(List<T> items) {
        return items.get(random.nextInt(items.size()));
    }

    private String getRandomDate() {
        List<String> days = Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday");
        List<String> months = Arrays.asList("January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December");

        String day = getRandomItem(days);
        String month = getRandomItem(months);
        int date = random.nextInt(28) + 1;
        int year = 2014;

        return String.format("%s, %s %d, %d", day, month, date, year);
    }

    private static class Joke {
        private final String setup;
        private final List<String> lines;

        public Joke(String setup, List<String> lines) {
            this.setup = setup;
            this.lines = lines;
        }

        public String getSetup() { return setup; }
        public List<String> getLines() { return lines; }
    }
}
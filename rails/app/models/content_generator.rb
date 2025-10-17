class ContentGenerator
  def initialize
    @main_article_titles = [
      "The monthly meeting rocked",
      "Quarterly review exceeds expectations",
      "Team building event brings everyone together",
      "New office policies announced",
      "Company picnic scheduled for next month"
    ]

    @main_article_contents = [
      "As with (almost) every last Friday of the month, we had our typical monthly meeting with the entire team. We received the sad news that, this month, the sales target — probably — will not be met. It was also announced that our 30th branch will open next month. Our CEO announced that with the arrival of the 50 new employees, the amount of coffee consumed increased slightly.",
      "The quarterly numbers are in and they show remarkable progress across all departments. Employee satisfaction surveys indicate a 15% improvement over last quarter. The new coffee machine in the break room has been particularly well-received by the team.",
      "Last Friday's team building activities brought together employees from all departments for a day of collaboration and fun. The escape room challenge was won by the marketing team, while the accounting department dominated the trivia contest.",
      "Management has announced several new policies aimed at improving work-life balance. The new flexible working hours policy will take effect next month, along with the introduction of casual Fridays.",
      "Save the date! Our annual company picnic has been scheduled for the last Saturday of next month. There will be games, food, and prizes for the whole family. RSVP deadline is two weeks from today."
    ]

    @left_column_titles = [
      "\"We want broccoli pie!\"",
      "\"Coffee machine needs fixing!\"",
      "\"More parking spaces needed!\"",
      "\"Bring back pizza Fridays!\"",
      "\"Office temperature too cold!\""
    ]

    @left_column_contents = [
      "Popular outcry was not silenced. But the broccoli pie protest came to a sad end. Informants claim that the result of the party at the office last Friday (26) was not friendly at all. Instead of the broccoli pie, the delivery lady brought chicken pie. The team's vegans, who currently make up 95% of the people, were disappointed.",
      "The office coffee machine has been acting up again, producing what can only be described as 'brown water' instead of coffee. Facilities management has promised a replacement by next week, but employees remain skeptical.",
      "With the recent hiring spree, the parking lot has become a battleground. Employees are arriving earlier just to secure a spot. Management is considering renting additional spaces across the street.",
      "The beloved pizza Friday tradition was discontinued last month due to budget constraints. A petition with over 200 signatures has been submitted to management requesting its return.",
      "The ongoing thermostat wars continue as employees bundle up in winter coats while working. The facilities team claims the temperature is 'optimal,' but the evidence suggests otherwise."
    ]

    @jokes = [
      {
        setup: "At the cinema box office:",
        lines: [
          "— Two tickets, please.",
          "— Is it for Romeo and Juliet?",
          "— No, it's for me and my girlfriend."
        ]
      },
      {
        setup: "At the office printer:",
        lines: [
          "— Why won't this print?",
          "— Did you try turning it off and on?",
          "— Yes, my computer is working fine."
        ]
      },
      {
        setup: "In the break room:",
        lines: [
          "— Is the coffee fresh?",
          "— Define fresh.",
          "— Made this century?"
        ]
      }
    ]
  end

  def generate_newsletter_data
    main_article = {
      title: get_random_item(@main_article_titles),
      content: get_random_item(@main_article_contents),
      imageCaption: "Photo of the online call via Google Meet held on Friday, #{get_random_date}."
    }

    left_column = {
      title: get_random_item(@left_column_titles),
      content: get_random_item(@left_column_contents)
    }

    joke = get_random_item(@jokes)
    right_column = {
      title: "Joke of the month",
      content: joke[:setup],
      jokeLines: joke[:lines],
      note: "Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it)."
    }

    {
      header: {
        edition: "Edition nº #{rand(100) + 1}",
        date: get_random_date
      },
      title: "Old County Times",
      mainArticle: main_article,
      leftColumn: left_column,
      rightColumn: right_column,
      comicSection: {
        title: "Comic strip of the month",
        caption: "Caption: Special thanks to Bia Franzoli for their amazing newspaper design inspiration"
      },
      contributeSection: {
        title: "Contribute to Old County Times",
        paragraphs: [
          "Tell us about everyday events at the company: we accept reports, images, jokes and whatever else your creativity allows. Share with us the achievements and defeats in your area so that we can always be together on this journey.",
          "Note: All contributions will be selected and evaluated by a mediator before entering the next edition."
        ]
      }
    }
  end

  private

  def get_random_item(array)
    array.sample
  end

  def get_random_date
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    months = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December']

    day = days.sample
    month = months.sample
    date = rand(28) + 1
    year = 2014

    "#{day}, #{month} #{date}, #{year}"
  end
end
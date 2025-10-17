from flask import Flask, jsonify, render_template_string, send_from_directory
import random
import threading
import time
import os

app = Flask(__name__, static_folder='../static')

class ContentGenerator:
    def __init__(self):
        self.main_article_titles = [
            "The monthly meeting rocked",
            "Quarterly review exceeds expectations",
            "Team building event brings everyone together",
            "New office policies announced",
            "Company picnic scheduled for next month"
        ]

        self.main_article_contents = [
            "As with (almost) every last Friday of the month, we had our typical monthly meeting with the entire team. We received the sad news that, this month, the sales target — probably — will not be met. It was also announced that our 30th branch will open next month. Our CEO announced that with the arrival of the 50 new employees, the amount of coffee consumed increased slightly.",
            "The quarterly numbers are in and they show remarkable progress across all departments. Employee satisfaction surveys indicate a 15% improvement over last quarter. The new coffee machine in the break room has been particularly well-received by the team.",
            "Last Friday's team building activities brought together employees from all departments for a day of collaboration and fun. The escape room challenge was won by the marketing team, while the accounting department dominated the trivia contest.",
            "Management has announced several new policies aimed at improving work-life balance. The new flexible working hours policy will take effect next month, along with the introduction of casual Fridays.",
            "Save the date! Our annual company picnic has been scheduled for the last Saturday of next month. There will be games, food, and prizes for the whole family. RSVP deadline is two weeks from today."
        ]

        self.left_column_titles = [
            '"We want broccoli pie!"',
            '"Coffee machine needs fixing!"',
            '"More parking spaces needed!"',
            '"Bring back pizza Fridays!"',
            '"Office temperature too cold!"'
        ]

        self.left_column_contents = [
            "Popular outcry was not silenced. But the broccoli pie protest came to a sad end. Informants claim that the result of the party at the office last Friday (26) was not friendly at all. Instead of the broccoli pie, the delivery lady brought chicken pie. The team's vegans, who currently make up 95% of the people, were disappointed.",
            "The office coffee machine has been acting up again, producing what can only be described as 'brown water' instead of coffee. Facilities management has promised a replacement by next week, but employees remain skeptical.",
            "With the recent hiring spree, the parking lot has become a battleground. Employees are arriving earlier just to secure a spot. Management is considering renting additional spaces across the street.",
            "The beloved pizza Friday tradition was discontinued last month due to budget constraints. A petition with over 200 signatures has been submitted to management requesting its return.",
            "The ongoing thermostat wars continue as employees bundle up in winter coats while working. The facilities team claims the temperature is 'optimal,' but the evidence suggests otherwise."
        ]

        self.jokes = [
            {
                "setup": "At the cinema box office:",
                "lines": [
                    "— Two tickets, please.",
                    "— Is it for Romeo and Juliet?",
                    "— No, it's for me and my girlfriend."
                ]
            },
            {
                "setup": "At the office printer:",
                "lines": [
                    "— Why won't this print?",
                    "— Did you try turning it off and on?",
                    "— Yes, my computer is working fine."
                ]
            },
            {
                "setup": "In the break room:",
                "lines": [
                    "— Is the coffee fresh?",
                    "— Define fresh.",
                    "— Made this century?"
                ]
            }
        ]

    def get_random_item(self, items):
        return random.choice(items)

    def get_random_date(self):
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December']
        
        day = random.choice(days)
        month = random.choice(months)
        date = random.randint(1, 28)
        year = 2014
        
        return f"{day}, {month} {date}, {year}"

    def generate_newsletter_data(self):
        main_article = {
            "title": self.get_random_item(self.main_article_titles),
            "content": self.get_random_item(self.main_article_contents),
            "imageCaption": f"Photo of the online call via Google Meet held on Friday, {self.get_random_date()}."
        }

        left_column = {
            "title": self.get_random_item(self.left_column_titles),
            "content": self.get_random_item(self.left_column_contents)
        }

        joke = self.get_random_item(self.jokes)
        right_column = {
            "title": "Joke of the month",
            "content": joke["setup"],
            "jokeLines": joke["lines"],
            "note": "Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it)."
        }

        return {
            "header": {
                "edition": f"Edition nº {random.randint(1, 100)}",
                "date": self.get_random_date()
            },
            "title": "Old County Times",
            "mainArticle": main_article,
            "leftColumn": left_column,
            "rightColumn": right_column,
            "comicSection": {
                "title": "Comic strip of the month",
                "caption": "Caption: Special thanks to Bia Franzoli for their amazing newspaper design inspiration"
            },
            "contributeSection": {
                "title": "Contribute to Old County Times",
                "paragraphs": [
                    "Tell us about everyday events at the company: we accept reports, images, jokes and whatever else your creativity allows. Share with us the achievements and defeats in your area so that we can always be together on this journey.",
                    "Note: All contributions will be selected and evaluated by a mediator before entering the next edition."
                ]
            }
        }

# Initialize content generator and current data
content_generator = ContentGenerator()
current_newsletter_data = content_generator.generate_newsletter_data()

def update_content():
    """Background thread to update content every minute"""
    global current_newsletter_data
    while True:
        time.sleep(60)  # Wait 60 seconds
        print("Generating new newsletter content...")
        current_newsletter_data = content_generator.generate_newsletter_data()

# Start background thread for content updates
update_thread = threading.Thread(target=update_content, daemon=True)
update_thread.start()

# HTML template
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Old County Times</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        @import url('https://fonts.cdnfonts.com/css/old-english-five');

        body {
            font-family: 'Crimson Text', serif;
            margin: 0;
            padding: 20px;
            color: #1a1a1a;
        }

        .newsletter {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px 50px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 14px;
            color: #333;
        }

        .title {
            font-family: 'Old English Five', sans-serif;
            font-size: 52px;
            text-align: center;
            margin: 30px 0;
            letter-spacing: 2px;
            font-weight: 700;
        }

        hr {
            border: none;
            border-top: 2px solid #333;
            margin: 20px 0;
        }

        h2 {
            font-size: 32px;
            font-weight: 600;
            margin: 30px 0 15px 0;
            line-height: 1.2;
        }

        p {
            font-size: 17px;
            line-height: 1.7;
            margin-bottom: 15px;
            text-align: justify;
        }

        .meeting-photo {
            width: 100%;
            height: auto;
            margin: 20px 0;
            border: 1px solid #ddd;
            filter: grayscale(100%) contrast(1.2) brightness(0.9);
        }

        .caption {
            text-align: center;
            font-size: 14px;
            font-style: italic;
            margin-top: 10px;
            color: #555;
        }

        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
        }

        .column {
            padding-right: 15px;
        }

        .column:last-child {
            border-left: 2px solid #333;
            padding-left: 30px;
            padding-right: 0;
        }

        .joke-lines {
            margin: 15px 0;
            line-height: 1.8;
        }

        .note {
            font-size: 15px;
            font-style: italic;
            margin-top: 15px;
        }

        .comic-strip {
            width: 100%;
            margin: 20px 0;
            border: 1px solid #ddd;
            filter: grayscale(100%) contrast(1.2) brightness(0.9);
        }

        .comic-caption {
            font-size: 14px;
            margin-top: 10px;
            color: #555;
        }

        .contribute {
            margin-top: 40px;
        }

        @media (max-width: 768px) {
            .newsletter {
                padding: 20px;
            }

            .title {
                font-size: 36px;
            }

            .two-column {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .column:last-child {
                border-left: none;
                border-top: 2px solid #333;
                padding-left: 0;
                padding-top: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="newsletter">
        <div class="header">
            <div>{{ data.header.edition }}</div>
            <div>{{ data.header.date }}</div>
        </div>

        <hr>

        <h1 class="title">{{ data.title }}</h1>

        <hr>

        <h2>{{ data.mainArticle.title }}</h2>

        <p>{{ data.mainArticle.content }}</p>

        <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop" alt="Company meeting - 80s style" class="meeting-photo">

        <div class="caption">{{ data.mainArticle.imageCaption }}</div>

        <hr>

        <div class="two-column">
            <div class="column">
                <h2>{{ data.leftColumn.title }}</h2>
                <p>{{ data.leftColumn.content }}</p>
            </div>

            <div class="column">
                <h2>{{ data.rightColumn.title }}</h2>
                <p>{{ data.rightColumn.content }}</p>
                <div class="joke-lines">
                    {% for line in data.rightColumn.jokeLines %}
                    {{ line }}<br>
                    {% endfor %}
                </div>
                <p class="note">{{ data.rightColumn.note }}</p>
            </div>
        </div>

        <hr>

        <h2>{{ data.comicSection.title }}</h2>

        <img src="/img/001.jpg" alt="Comic strip of the month" class="comic-strip">

        <div class="comic-caption">{{ data.comicSection.caption }}</div>

        <hr>

        <div class="contribute">
            <h2>{{ data.contributeSection.title }}</h2>
            {% for paragraph in data.contributeSection.paragraphs %}
            <p>{{ paragraph }}</p>
            {% endfor %}
        </div>
    </div>

    <script>
        // Auto-refresh functionality to fetch new content every minute
        let currentData = {{ data | tojson }};
        
        async function fetchNewsletterData() {
            try {
                const response = await fetch('/api/newsletter-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch newsletter data');
                }
                const newData = await response.json();
                
                // Check if data has changed
                if (JSON.stringify(newData) !== JSON.stringify(currentData)) {
                    console.log('Newsletter content updated, refreshing page...');
                    currentData = newData;
                    // Reload the page to show new content
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error fetching newsletter data:', error);
            }
        }

        // Check for updates every 30 seconds (more responsive than waiting full minute)
        setInterval(fetchNewsletterData, 30000);
        
        console.log('Old County Times loaded. Content will auto-refresh when updated.');
    </script>
</body>
</html>"""

# Routes
@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, data=current_newsletter_data)

@app.route('/api/newsletter-data')
def api_newsletter_data():
    return jsonify(current_newsletter_data)

# Serve static files from the static directory
@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('../static/js', filename)

@app.route('/img/<path:filename>')
def serve_img(filename):
    return send_from_directory('../static/img', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    print(f"Old County Times Python Flask server running on http://localhost:{port}")
    print("Content will be regenerated every minute")
    app.run(host='0.0.0.0', port=port, debug=False)
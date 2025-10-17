package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"math/rand"
	"net/http"
	"path/filepath"
	"time"
)

// NewsletterData represents the structure of newsletter content
type NewsletterData struct {
	Header struct {
		Edition string `json:"edition"`
		Date    string `json:"date"`
	} `json:"header"`
	Title        string      `json:"title"`
	MainArticle  Article     `json:"mainArticle"`
	LeftColumn   Column      `json:"leftColumn"`
	RightColumn  RightColumn `json:"rightColumn"`
	ComicSection struct {
		Title   string `json:"title"`
		Caption string `json:"caption"`
	} `json:"comicSection"`
	ContributeSection struct {
		Title      string   `json:"title"`
		Paragraphs []string `json:"paragraphs"`
	} `json:"contributeSection"`
}

type Article struct {
	Title        string `json:"title"`
	Content      string `json:"content"`
	ImageCaption string `json:"imageCaption"`
}

type Column struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type RightColumn struct {
	Title     string   `json:"title"`
	Content   string   `json:"content"`
	JokeLines []string `json:"jokeLines"`
	Note      string   `json:"note"`
}

// ContentGenerator handles random content generation
type ContentGenerator struct {
	mainArticleTitles   []string
	mainArticleContents []string
	leftColumnTitles    []string
	leftColumnContents  []string
	jokes               []Joke
}

type Joke struct {
	Setup string   `json:"setup"`
	Lines []string `json:"lines"`
}

// NewContentGenerator creates a new content generator with predefined content
func NewContentGenerator() *ContentGenerator {
	return &ContentGenerator{
		mainArticleTitles: []string{
			"The monthly meeting rocked",
			"Quarterly review exceeds expectations",
			"Team building event brings everyone together",
			"New office policies announced",
			"Company picnic scheduled for next month",
		},
		mainArticleContents: []string{
			"As with (almost) every last Friday of the month, we had our typical monthly meeting with the entire team. We received the sad news that, this month, the sales target — probably — will not be met. It was also announced that our 30th branch will open next month. Our CEO announced that with the arrival of the 50 new employees, the amount of coffee consumed increased slightly.",
			"The quarterly numbers are in and they show remarkable progress across all departments. Employee satisfaction surveys indicate a 15% improvement over last quarter. The new coffee machine in the break room has been particularly well-received by the team.",
			"Last Friday's team building activities brought together employees from all departments for a day of collaboration and fun. The escape room challenge was won by the marketing team, while the accounting department dominated the trivia contest.",
			"Management has announced several new policies aimed at improving work-life balance. The new flexible working hours policy will take effect next month, along with the introduction of casual Fridays.",
			"Save the date! Our annual company picnic has been scheduled for the last Saturday of next month. There will be games, food, and prizes for the whole family. RSVP deadline is two weeks from today.",
		},
		leftColumnTitles: []string{
			"\"We want broccoli pie!\"",
			"\"Coffee machine needs fixing!\"",
			"\"More parking spaces needed!\"",
			"\"Bring back pizza Fridays!\"",
			"\"Office temperature too cold!\"",
		},
		leftColumnContents: []string{
			"Popular outcry was not silenced. But the broccoli pie protest came to a sad end. Informants claim that the result of the party at the office last Friday (26) was not friendly at all. Instead of the broccoli pie, the delivery lady brought chicken pie. The team's vegans, who currently make up 95% of the people, were disappointed.",
			"The office coffee machine has been acting up again, producing what can only be described as 'brown water' instead of coffee. Facilities management has promised a replacement by next week, but employees remain skeptical.",
			"With the recent hiring spree, the parking lot has become a battleground. Employees are arriving earlier just to secure a spot. Management is considering renting additional spaces across the street.",
			"The beloved pizza Friday tradition was discontinued last month due to budget constraints. A petition with over 200 signatures has been submitted to management requesting its return.",
			"The ongoing thermostat wars continue as employees bundle up in winter coats while working. The facilities team claims the temperature is 'optimal,' but the evidence suggests otherwise.",
		},
		jokes: []Joke{
			{
				Setup: "At the cinema box office:",
				Lines: []string{
					"— Two tickets, please.",
					"— Is it for Romeo and Juliet?",
					"— No, it's for me and my girlfriend.",
				},
			},
			{
				Setup: "At the office printer:",
				Lines: []string{
					"— Why won't this print?",
					"— Did you try turning it off and on?",
					"— Yes, my computer is working fine.",
				},
			},
			{
				Setup: "In the break room:",
				Lines: []string{
					"— Is the coffee fresh?",
					"— Define fresh.",
					"— Made this century?",
				},
			},
		},
	}
}

func (cg *ContentGenerator) getRandomItem(items []string) string {
	return items[rand.Intn(len(items))]
}

func (cg *ContentGenerator) getRandomJoke() Joke {
	return cg.jokes[rand.Intn(len(cg.jokes))]
}

func (cg *ContentGenerator) getRandomDate() string {
	days := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}
	months := []string{"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"}

	day := days[rand.Intn(len(days))]
	month := months[rand.Intn(len(months))]
	date := rand.Intn(28) + 1
	year := 2014

	return fmt.Sprintf("%s, %s %d, %d", day, month, date, year)
}

func (cg *ContentGenerator) GenerateNewsletterData() NewsletterData {
	mainArticle := Article{
		Title:        cg.getRandomItem(cg.mainArticleTitles),
		Content:      cg.getRandomItem(cg.mainArticleContents),
		ImageCaption: fmt.Sprintf("Photo of the online call via Google Meet held on Friday, %s.", cg.getRandomDate()),
	}

	leftColumn := Column{
		Title:   cg.getRandomItem(cg.leftColumnTitles),
		Content: cg.getRandomItem(cg.leftColumnContents),
	}

	joke := cg.getRandomJoke()
	rightColumn := RightColumn{
		Title:     "Joke of the month",
		Content:   joke.Setup,
		JokeLines: joke.Lines,
		Note:      "Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it).",
	}

	data := NewsletterData{
		Title:       "Old County Times",
		MainArticle: mainArticle,
		LeftColumn:  leftColumn,
		RightColumn: rightColumn,
	}

	data.Header.Edition = fmt.Sprintf("Edition nº %d", rand.Intn(100)+1)
	data.Header.Date = cg.getRandomDate()

	data.ComicSection.Title = "Comic strip of the month"
	data.ComicSection.Caption = "Caption: Special thanks to Bia Franzoli for their amazing newspaper design inspiration"

	data.ContributeSection.Title = "Contribute to Old County Times"
	data.ContributeSection.Paragraphs = []string{
		"Tell us about everyday events at the company: we accept reports, images, jokes and whatever else your creativity allows. Share with us the achievements and defeats in your area so that we can always be together on this journey.",
		"Note: All contributions will be selected and evaluated by a mediator before entering the next edition.",
	}

	return data
}

// Global variables
var (
	contentGenerator      *ContentGenerator
	currentNewsletterData NewsletterData
)

func main() {
	// Initialize random seed
	rand.Seed(time.Now().UnixNano())

	// Initialize content generator
	contentGenerator = NewContentGenerator()
	currentNewsletterData = contentGenerator.GenerateNewsletterData()

	// Update content every minute
	go func() {
		ticker := time.NewTicker(1 * time.Minute)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				log.Println("Generating new newsletter content...")
				currentNewsletterData = contentGenerator.GenerateNewsletterData()
			}
		}
	}()

	// Set up HTTP handlers
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/api/newsletter-data", apiHandler)

	// Serve static files from the static directory
	staticDir := filepath.Join("..", "static")
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir(filepath.Join(staticDir, "js")))))
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir(filepath.Join(staticDir, "img")))))

	// Start server
	port := "3000"
	log.Printf("Old County Times Go server running on http://localhost:%s", port)
	log.Println("Content will be regenerated every minute")

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	// Serve the HTML template with embedded newsletter data
	tmpl := `<!DOCTYPE html>
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
            <div>{{.Header.Edition}}</div>
            <div>{{.Header.Date}}</div>
        </div>

        <hr>

        <h1 class="title">{{.Title}}</h1>

        <hr>

        <h2>{{.MainArticle.Title}}</h2>

        <p>{{.MainArticle.Content}}</p>

        <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop" alt="Company meeting - 80s style" class="meeting-photo">

        <div class="caption">{{.MainArticle.ImageCaption}}</div>

        <hr>

        <div class="two-column">
            <div class="column">
                <h2>{{.LeftColumn.Title}}</h2>
                <p>{{.LeftColumn.Content}}</p>
            </div>

            <div class="column">
                <h2>{{.RightColumn.Title}}</h2>
                <p>{{.RightColumn.Content}}</p>
                <div class="joke-lines">{{range .RightColumn.JokeLines}}{{.}}<br>{{end}}</div>
                <p class="note">{{.RightColumn.Note}}</p>
            </div>
        </div>

        <hr>

        <h2>{{.ComicSection.Title}}</h2>

        <img src="/img/001.jpg" alt="Comic strip of the month" class="comic-strip">

        <div class="comic-caption">{{.ComicSection.Caption}}</div>

        <hr>

        <div class="contribute">
            <h2>{{.ContributeSection.Title}}</h2>
            {{range .ContributeSection.Paragraphs}}
            <p>{{.}}</p>
            {{end}}
        </div>
    </div>
</body>
</html>`

	t, err := template.New("newsletter").Parse(tmpl)
	if err != nil {
		http.Error(w, "Template parsing error", http.StatusInternalServerError)
		log.Printf("Template parsing error: %v", err)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	if err := t.Execute(w, currentNewsletterData); err != nil {
		http.Error(w, "Template execution error", http.StatusInternalServerError)
		log.Printf("Template execution error: %v", err)
		return
	}
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(currentNewsletterData); err != nil {
		http.Error(w, "JSON encoding error", http.StatusInternalServerError)
		log.Printf("JSON encoding error: %v", err)
		return
	}
}

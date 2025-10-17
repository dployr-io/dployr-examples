<?php
// PHP implementation of Old County Times newspaper application
// Similar to Go and Node.js versions

class ContentGenerator {
    private $mainArticleTitles = [
        "The monthly meeting rocked",
        "Quarterly review exceeds expectations", 
        "Team building event brings everyone together",
        "New office policies announced",
        "Company picnic scheduled for next month"
    ];

    private $mainArticleContents = [
        "As with (almost) every last Friday of the month, we had our typical monthly meeting with the entire team. We received the sad news that, this month, the sales target — probably — will not be met. It was also announced that our 30th branch will open next month. Our CEO announced that with the arrival of the 50 new employees, the amount of coffee consumed increased slightly.",
        "The quarterly numbers are in and they show remarkable progress across all departments. Employee satisfaction surveys indicate a 15% improvement over last quarter. The new coffee machine in the break room has been particularly well-received by the team.",
        "Last Friday's team building activities brought together employees from all departments for a day of collaboration and fun. The escape room challenge was won by the marketing team, while the accounting department dominated the trivia contest.",
        "Management has announced several new policies aimed at improving work-life balance. The new flexible working hours policy will take effect next month, along with the introduction of casual Fridays.",
        "Save the date! Our annual company picnic has been scheduled for the last Saturday of next month. There will be games, food, and prizes for the whole family. RSVP deadline is two weeks from today."
    ];

    private $leftColumnTitles = [
        "\"We want broccoli pie!\"",
        "\"Coffee machine needs fixing!\"",
        "\"More parking spaces needed!\"",
        "\"Bring back pizza Fridays!\"",
        "\"Office temperature too cold!\""
    ];

    private $leftColumnContents = [
        "Popular outcry was not silenced. But the broccoli pie protest came to a sad end. Informants claim that the result of the party at the office last Friday (26) was not friendly at all. Instead of the broccoli pie, the delivery lady brought chicken pie. The team's vegans, who currently make up 95% of the people, were disappointed.",
        "The office coffee machine has been acting up again, producing what can only be described as 'brown water' instead of coffee. Facilities management has promised a replacement by next week, but employees remain skeptical.",
        "With the recent hiring spree, the parking lot has become a battleground. Employees are arriving earlier just to secure a spot. Management is considering renting additional spaces across the street.",
        "The beloved pizza Friday tradition was discontinued last month due to budget constraints. A petition with over 200 signatures has been submitted to management requesting its return.",
        "The ongoing thermostat wars continue as employees bundle up in winter coats while working. The facilities team claims the temperature is 'optimal,' but the evidence suggests otherwise."
    ];

    private $jokes = [
        [
            "setup" => "At the cinema box office:",
            "lines" => [
                "— Two tickets, please.",
                "— Is it for Romeo and Juliet?",
                "— No, it's for me and my girlfriend."
            ]
        ],
        [
            "setup" => "At the office printer:",
            "lines" => [
                "— Why won't this print?",
                "— Did you try turning it off and on?",
                "— Yes, my computer is working fine."
            ]
        ],
        [
            "setup" => "In the break room:",
            "lines" => [
                "— Is the coffee fresh?",
                "— Define fresh.",
                "— Made this century?"
            ]
        ]
    ];

    private function getRandomItem($array) {
        return $array[array_rand($array)];
    }

    private function getRandomDate() {
        $days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        $months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
        
        $day = $this->getRandomItem($days);
        $month = $this->getRandomItem($months);
        $date = rand(1, 28);
        $year = 2014;
        
        return "$day, $month $date, $year";
    }

    public function generateNewsletterData() {
        $mainArticle = [
            "title" => $this->getRandomItem($this->mainArticleTitles),
            "content" => $this->getRandomItem($this->mainArticleContents),
            "imageCaption" => "Photo of the online call via Google Meet held on Friday, " . $this->getRandomDate() . "."
        ];

        $leftColumn = [
            "title" => $this->getRandomItem($this->leftColumnTitles),
            "content" => $this->getRandomItem($this->leftColumnContents)
        ];

        $joke = $this->getRandomItem($this->jokes);
        $rightColumn = [
            "title" => "Joke of the month",
            "content" => $joke["setup"],
            "jokeLines" => $joke["lines"],
            "note" => "Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it)."
        ];

        return [
            "header" => [
                "edition" => "Edition nº " . (rand(1, 100)),
                "date" => $this->getRandomDate()
            ],
            "title" => "Old County Times",
            "mainArticle" => $mainArticle,
            "leftColumn" => $leftColumn,
            "rightColumn" => $rightColumn,
            "comicSection" => [
                "title" => "Comic strip of the month",
                "caption" => "Caption: Special thanks to Bia Franzoli for their amazing newspaper design inspiration"
            ],
            "contributeSection" => [
                "title" => "Contribute to Old County Times",
                "paragraphs" => [
                    "Tell us about everyday events at the company: we accept reports, images, jokes and whatever else your creativity allows. Share with us the achievements and defeats in your area so that we can always be together on this journey.",
                    "Note: All contributions will be selected and evaluated by a mediator before entering the next edition."
                ]
            ]
        ];
    }
}

// Initialize content generator and generate initial data
$contentGenerator = new ContentGenerator();

// Handle different routes
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Handle API endpoint
if ($requestUri === '/api/newsletter-data' && $requestMethod === 'GET') {
    header('Content-Type: application/json');
    echo json_encode($contentGenerator->generateNewsletterData());
    exit;
}

// Handle static file serving
if (preg_match('/\.(js|css|jpg|jpeg|png|gif|ico)$/', $requestUri)) {
    $staticPath = '../static' . $requestUri;
    if (file_exists($staticPath)) {
        $mimeTypes = [
            'js' => 'application/javascript',
            'css' => 'text/css',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon'
        ];
        
        $extension = pathinfo($staticPath, PATHINFO_EXTENSION);
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
        
        header("Content-Type: $mimeType");
        readfile($staticPath);
        exit;
    }
}

// Handle root path - serve HTML with embedded newsletter data
if ($requestUri === '/' || $requestUri === '') {
    $newsletterData = $contentGenerator->generateNewsletterData();
    
    // HTML template with embedded data
    $html = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Old County Times</title>
    <style>
        @import url(\'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap\');
        @import url(\'https://fonts.cdnfonts.com/css/old-english-five\');

        body {
            font-family: \'Crimson Text\', serif;
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
            font-family: \'Old English Five\', sans-serif;
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
            <div>' . htmlspecialchars($newsletterData['header']['edition']) . '</div>
            <div>' . htmlspecialchars($newsletterData['header']['date']) . '</div>
        </div>

        <hr>

        <h1 class="title">' . htmlspecialchars($newsletterData['title']) . '</h1>

        <hr>

        <h2>' . htmlspecialchars($newsletterData['mainArticle']['title']) . '</h2>

        <p>' . htmlspecialchars($newsletterData['mainArticle']['content']) . '</p>

        <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop" alt="Company meeting - 80s style" class="meeting-photo">

        <div class="caption">' . htmlspecialchars($newsletterData['mainArticle']['imageCaption']) . '</div>

        <hr>

        <div class="two-column">
            <div class="column">
                <h2>' . htmlspecialchars($newsletterData['leftColumn']['title']) . '</h2>
                <p>' . htmlspecialchars($newsletterData['leftColumn']['content']) . '</p>
            </div>

            <div class="column">
                <h2>' . htmlspecialchars($newsletterData['rightColumn']['title']) . '</h2>
                <p>' . htmlspecialchars($newsletterData['rightColumn']['content']) . '</p>
                <div class="joke-lines">';
    
    foreach ($newsletterData['rightColumn']['jokeLines'] as $line) {
        $html .= htmlspecialchars($line) . '<br>';
    }
    
    $html .= '</div>
                <p class="note">' . htmlspecialchars($newsletterData['rightColumn']['note']) . '</p>
            </div>
        </div>

        <hr>

        <h2>' . htmlspecialchars($newsletterData['comicSection']['title']) . '</h2>

        <img src="/img/001.jpg" alt="Comic strip of the month" class="comic-strip">

        <div class="comic-caption">' . htmlspecialchars($newsletterData['comicSection']['caption']) . '</div>

        <hr>

        <div class="contribute">
            <h2>' . htmlspecialchars($newsletterData['contributeSection']['title']) . '</h2>';
    
    foreach ($newsletterData['contributeSection']['paragraphs'] as $paragraph) {
        $html .= '<p>' . htmlspecialchars($paragraph) . '</p>';
    }
    
    $html .= '
        </div>
    </div>
</body>
</html>';

    header('Content-Type: text/html');
    echo $html;
    exit;
}

// 404 for other routes
http_response_code(404);
echo "404 Not Found";
?>
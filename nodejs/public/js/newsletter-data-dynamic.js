// Dynamic newsletter data that fetches from the API
let newsletterData = {
    header: {
        edition: "Edition nº 1",
        date: "Thursday, September 1, 2014"
    },
    title: "Old County Times",
    mainArticle: {
        title: "Loading...",
        content: "Content is being loaded...",
        imageCaption: "Loading image..."
    },
    leftColumn: {
        title: "Loading...",
        content: "Content is being loaded..."
    },
    rightColumn: {
        title: "Joke of the month",
        content: "Loading...",
        jokeLines: ["Loading..."],
        note: "Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it)."
    },
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
};

// Fetch newsletter data from the API
async function fetchNewsletterData() {
    try {
        const response = await fetch('/api/newsletter-data');
        if (!response.ok) {
            throw new Error('Failed to fetch newsletter data');
        }
        const newData = await response.json();
        newsletterData = newData;
        console.log('Newsletter data updated:', newsletterData);

        // Trigger a re-render if the newsletter app is already initialized
        if (window.app && typeof window.app.populateContent === 'function') {
            window.app.populateContent();
            window.app.loadRandomHeroImage();
            window.app.loadRandomComicStrip();
            setTimeout(() => window.app.applyBlackWhiteFilter(), 500);
        }
    } catch (error) {
        console.error('Error fetching newsletter data:', error);
    }
}

// Initialize data loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchNewsletterData);
} else {
    fetchNewsletterData();
}

// Refresh data every minute
setInterval(fetchNewsletterData, 60000);
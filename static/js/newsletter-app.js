// Newsletter application logic
class NewsletterApp {
    constructor() {
        this.comicImages = ['001.jpg', '002.jpg', '003.jpg', '004.jpg', '005.jpg'];
        this.heroImageSources = [
            'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop'
        ];
    }

    // Get random item from array
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Apply black and white filter to images
    applyBlackWhiteFilter() {
        const images = document.querySelectorAll('.meeting-photo, .comic-strip');
        images.forEach(img => {
            img.style.filter = 'grayscale(100%) contrast(1.2) brightness(0.9)';
        });
    }

    // Load random hero image
    loadRandomHeroImage() {
        const heroImage = document.querySelector('.meeting-photo');
        if (heroImage) {
            const randomSource = this.getRandomItem(this.heroImageSources);
            heroImage.src = randomSource;
            heroImage.alt = "Company meeting - 80s style";
        }
    }

    // Load random comic strip
    loadRandomComicStrip() {
        const comicImage = document.querySelector('.comic-strip');
        if (comicImage) {
            const randomComic = this.getRandomItem(this.comicImages);
            comicImage.src = `img/${randomComic}`;
            comicImage.alt = "Comic strip of the month";
        }
    }

    // Populate content from data
    populateContent() {
        try {
            // Header
            const headerDivs = document.querySelectorAll('.header div');
            if (headerDivs.length >= 2) {
                headerDivs[0].textContent = newsletterData.header.edition;
                headerDivs[1].textContent = newsletterData.header.date;
            }

            // Title
            const titleElement = document.querySelector('.title');
            if (titleElement) {
                titleElement.textContent = newsletterData.title;
            }

            // Main article - get all h2 and p elements in order
            const allH2s = document.querySelectorAll('h2');
            const allPs = document.querySelectorAll('p');

            if (allH2s.length > 0) {
                allH2s[0].textContent = newsletterData.mainArticle.title;
            }

            if (allPs.length > 0) {
                allPs[0].textContent = newsletterData.mainArticle.content;
            }

            const captionElement = document.querySelector('.caption');
            if (captionElement) {
                captionElement.textContent = newsletterData.mainArticle.imageCaption;
            }

            // Two column section
            const columns = document.querySelectorAll('.column');
            if (columns.length >= 2) {
                // Left column
                const leftH2 = columns[0].querySelector('h2');
                const leftP = columns[0].querySelector('p');
                if (leftH2) leftH2.textContent = newsletterData.leftColumn.title;
                if (leftP) leftP.textContent = newsletterData.leftColumn.content;

                // Right column
                const rightH2 = columns[1].querySelector('h2');
                const rightPs = columns[1].querySelectorAll('p');
                if (rightH2) rightH2.textContent = newsletterData.rightColumn.title;
                if (rightPs.length > 0) rightPs[0].textContent = newsletterData.rightColumn.content;

                // Joke lines
                const jokeContainer = columns[1].querySelector('.joke-lines');
                if (jokeContainer) {
                    jokeContainer.innerHTML = newsletterData.rightColumn.jokeLines.join('<br>');
                }

                // Note
                const noteElement = columns[1].querySelector('.note');
                if (noteElement) {
                    noteElement.textContent = newsletterData.rightColumn.note;
                }
            }

            // Comic section - find the h2 after the two-column section
            if (allH2s.length > 2) {
                allH2s[2].textContent = newsletterData.comicSection.title;
            }

            const comicCaptionElement = document.querySelector('.comic-caption');
            if (comicCaptionElement) {
                comicCaptionElement.textContent = newsletterData.comicSection.caption;
            }

            // Contribute section
            const contributeSection = document.querySelector('.contribute');
            if (contributeSection) {
                const contributeH2 = contributeSection.querySelector('h2');
                if (contributeH2) {
                    contributeH2.textContent = newsletterData.contributeSection.title;
                }

                const contributeParagraphs = contributeSection.querySelectorAll('p');
                newsletterData.contributeSection.paragraphs.forEach((text, index) => {
                    if (contributeParagraphs[index]) {
                        contributeParagraphs[index].textContent = text;
                    }
                });
            }

        } catch (error) {
            console.error('Error populating content:', error);
            // Fallback: show error message
            document.body.innerHTML = `
                <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                    <h1>Loading Error</h1>
                    <p>There was an error loading the newsletter content.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }

    // Initialize the application
    init() {
        console.log('Initializing Newsletter App...');

        // Check if newsletter data is available
        if (typeof newsletterData === 'undefined') {
            console.error('Newsletter data not loaded!');
            return;
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM loaded, populating content...');
                this.populateContent();
                this.loadRandomHeroImage();
                this.loadRandomComicStrip();
                // Apply black and white filter after images load
                setTimeout(() => this.applyBlackWhiteFilter(), 500);
            });
        } else {
            console.log('DOM already ready, populating content...');
            this.populateContent();
            this.loadRandomHeroImage();
            this.loadRandomComicStrip();
            setTimeout(() => this.applyBlackWhiteFilter(), 500);
        }
    }
}

// Initialize the newsletter app
const app = new NewsletterApp();
app.init();
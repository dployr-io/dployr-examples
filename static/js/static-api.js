/**
 * Static API Mock for Dployr Times
 * Mocks the /api/generate endpoint locally using ContentGenerator
 */

class StaticAPI {
    constructor() {
        this.contentGenerator = new ContentGenerator();
    }

    /**
     * Mock /api/generate endpoint
     * @returns {Promise<Object>} Generated content matching API contract
     */
    async generate() {
        // Simulate network delay for realistic experience
        await this.delay(500 + Math.random() * 1000);

        try {
            // Generate articles (3-5 articles as per requirements)
            const articleCount = this.contentGenerator.getRandomNumber(3, 5);
            const articles = this.contentGenerator.generateArticles(articleCount);

            // Generate hero content (main headline)
            const heroArticle = this.contentGenerator.generateArticle();

            // Generate sidebar content
            const facts = this.contentGenerator.generateRandomFacts(4);
            const classifieds = this.contentGenerator.generateClassifiedAds(3);

            // Return content matching the API contract
            return {
                success: true,
                articles: articles,
                hero: {
                    title: heroArticle.title,
                    body: heroArticle.body.split('\n\n')[0], // First paragraph only for hero
                    image: heroArticle.image,
                    author_image: heroArticle.author_image,
                    timestamp: heroArticle.timestamp
                },
                sidebar: {
                    facts: facts,
                    classifieds: classifieds
                },
                generated_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error generating content:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Fallback content when generation fails
     * @returns {Object} Basic fallback content
     */
    getFallbackContent() {
        return {
            success: false,
            articles: [
                {
                    id: 'fallback-1',
                    title: 'Welcome to The Dployr Times',
                    image: 'https://picsum.photos/400/300?random=1',
                    author_image: 'https://thispersondoesnotexist.com/image?1',
                    body: 'This is a demonstration of the static HTML/JavaScript version of the Dployr Times newspaper application. Content generation is currently unavailable, but you can still explore the interface and functionality.',
                    category: 'Technology',
                    timestamp: new Date().toISOString()
                }
            ],
            hero: {
                title: 'Static Version Demo',
                body: 'Experience the power of static web applications with dynamic content generation.',
                image: 'https://picsum.photos/400/300?random=hero',
                author_image: 'https://thispersondoesnotexist.com/image?hero',
                timestamp: new Date().toISOString()
            },
            sidebar: {
                facts: [
                    'This is a static HTML/JavaScript implementation.',
                    'Content is generated locally in your browser.',
                    'No server required for basic functionality.'
                ],
                classifieds: [
                    'FOR SALE: Static website, fully functional. No server required!',
                    'WANTED: JavaScript developer to appreciate this demo.',
                    'FREE: Unlimited page refreshes. Batteries not included.'
                ]
            },
            generated_at: new Date().toISOString()
        };
    }

    /**
     * Simulate network delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Mock save endpoint for localStorage
     * @param {Object} data - Data to save
     * @returns {Promise<Object>} Save response
     */
    async save(data) {
        await this.delay(200); // Simulate save delay

        try {
            const storage = new LocalStorage();
            const result = storage.savePage(data);

            return {
                success: true,
                id: result.id,
                message: 'Page saved successfully',
                saved_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error saving data:', error);
            return {
                success: false,
                error: 'Failed to save page',
                message: error.message
            };
        }
    }

    /**
     * Mock highlights endpoint for localStorage
     * @returns {Promise<Object>} Highlights response
     */
    async getHighlights() {
        await this.delay(100); // Simulate fetch delay

        try {
            const storage = new LocalStorage();
            const highlights = storage.getHighlights();

            return {
                success: true,
                highlights: highlights,
                count: highlights.length,
                retrieved_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error retrieving highlights:', error);
            return {
                success: false,
                highlights: [],
                error: 'Failed to retrieve highlights',
                message: error.message
            };
        }
    }

    /**
     * Save a highlight
     * @param {Object} highlight - Highlight data
     * @returns {Promise<Object>} Save response
     */
    async saveHighlight(highlight) {
        await this.delay(100);

        try {
            const storage = new LocalStorage();
            const result = storage.saveHighlight(highlight);

            return {
                success: true,
                id: result.id,
                message: 'Highlight saved successfully',
                saved_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error saving highlight:', error);
            return {
                success: false,
                error: 'Failed to save highlight',
                message: error.message
            };
        }
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.StaticAPI = StaticAPI;
}
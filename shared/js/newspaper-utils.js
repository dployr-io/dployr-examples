/**
 * Newspaper Utilities - Combined Content Generation and API Integration
 * Main utility class that combines ContentGenerator and ApiHelpers for easy use
 */

// Import dependencies (will work in both browser and Node.js environments)
let ContentGenerator, ApiHelpers;

if (typeof require !== 'undefined') {
    // Node.js environment
    ContentGenerator = require('./content-generator.js');
    ApiHelpers = require('./api-helpers.js');
} else {
    // Browser environment - assumes scripts are loaded
    ContentGenerator = window.ContentGenerator;
    ApiHelpers = window.ApiHelpers;
}

class NewspaperUtils {
    constructor() {
        this.contentGenerator = new ContentGenerator();
        this.apiHelpers = new ApiHelpers();
        this.isInitialized = false;
    }

    /**
     * Initialize the newspaper utilities
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            // Preload fallback images if in browser environment
            if (typeof window !== 'undefined') {
                await this.apiHelpers.preloadFallbackImages();
            }

            // Test API availability
            const healthStatus = await this.apiHelpers.getApiHealthStatus();
            console.log('API Health Status:', healthStatus);

            this.isInitialized = true;
        } catch (error) {
            console.warn('Failed to initialize newspaper utilities:', error);
            this.isInitialized = true; // Continue with degraded functionality
        }
    }

    /**
     * Generate a complete newspaper page with articles
     * @param {number} articleCount - Number of articles to generate
     * @returns {Promise<Object>} Complete newspaper data
     */
    async generateNewspaperPage(articleCount = 4) {
        await this.initialize();

        try {
            const articles = await this.generateArticlesWithImages(articleCount);
            const heroArticle = articles[0]; // Use first article as hero
            const sidebarContent = this.generateSidebarContent();

            return {
                hero: {
                    headline: heroArticle.title,
                    image: heroArticle.author_image, // Use author image for hero
                    subtext: heroArticle.body.split('\n\n')[0] // First paragraph as subtext
                },
                articles: articles.slice(1), // Remaining articles
                sidebar: sidebarContent,
                metadata: {
                    generated_at: new Date().toISOString(),
                    article_count: articles.length,
                    api_status: await this.apiHelpers.getApiHealthStatus()
                }
            };
        } catch (error) {
            console.error('Failed to generate newspaper page:', error);
            return this.generateFallbackNewspaperPage();
        }
    }

    /**
     * Generate articles with properly fetched images
     * @param {number} count - Number of articles to generate
     * @returns {Promise<Array<Object>>} Array of articles with images
     */
    async generateArticlesWithImages(count = 4) {
        // Generate base articles
        const articles = this.contentGenerator.generateArticles(count);

        // Prepare image requests
        const imageRequests = [];
        articles.forEach((article, index) => {
            // Article image
            imageRequests.push({
                type: 'article',
                width: 400,
                height: 300,
                seed: index * 2
            });
            // Author image
            imageRequests.push({
                type: 'author',
                seed: index * 2 + 1
            });
        });

        try {
            // Batch fetch all images
            const images = await this.apiHelpers.batchFetchImages(imageRequests);

            // Assign images to articles
            articles.forEach((article, index) => {
                article.image = images[index * 2]; // Article image
                article.author_image = images[index * 2 + 1]; // Author image
            });

            return articles;
        } catch (error) {
            console.warn('Failed to fetch images, using fallbacks:', error);

            // Use fallback images
            articles.forEach(article => {
                article.image = this.apiHelpers.getFallbackImage();
                article.author_image = this.apiHelpers.getFallbackAuthorImage();
            });

            return articles;
        }
    }

    /**
     * Generate sidebar content (facts and classified ads)
     * @returns {Object} Sidebar content
     */
    generateSidebarContent() {
        return {
            facts: this.contentGenerator.generateRandomFacts(3),
            classifiedAds: this.contentGenerator.generateClassifiedAds(3),
            title: "Did You Know?",
            adsTitle: "Classified Corner"
        };
    }

    /**
     * Generate fallback newspaper page when everything fails
     * @returns {Object} Fallback newspaper data
     */
    generateFallbackNewspaperPage() {
        const fallbackContent = this.apiHelpers.generateFallbackContent();

        return {
            hero: {
                headline: fallbackContent.headline,
                image: fallbackContent.author_image,
                subtext: "We're working to restore our content services. Thank you for your patience."
            },
            articles: [
                {
                    ...fallbackContent,
                    title: "Service Update: Technical Maintenance in Progress"
                },
                {
                    ...fallbackContent,
                    title: "Community News: Local Events Continue",
                    body: "Despite technical challenges, our community remains active and engaged. Check back soon for updates."
                }
            ],
            sidebar: {
                facts: [
                    "The Dployr Times is committed to reliable news delivery.",
                    "Our technical team is working around the clock.",
                    "Thank you for your patience during maintenance."
                ],
                classifiedAds: [
                    "NOTICE: Technical maintenance in progress.",
                    "THANK YOU: For your continued readership.",
                    "COMING SOON: Enhanced content delivery."
                ],
                title: "Service Notes",
                adsTitle: "Announcements"
            },
            metadata: {
                generated_at: new Date().toISOString(),
                article_count: 2,
                fallback_mode: true
            }
        };
    }

    /**
     * Mock API endpoint for /api/generate (used by static version)
     * @returns {Promise<Object>} API response format
     */
    async mockApiGenerate() {
        const newspaperData = await this.generateNewspaperPage();

        return {
            articles: [
                // Include hero as first article
                {
                    id: this.contentGenerator.generateId(),
                    title: newspaperData.hero.headline,
                    image: newspaperData.hero.image,
                    author_image: this.apiHelpers.getFallbackAuthorImage(),
                    body: newspaperData.hero.subtext,
                    category: "Breaking News",
                    timestamp: new Date().toISOString()
                },
                ...newspaperData.articles
            ]
        };
    }

    /**
     * Save page data (for localStorage in static version)
     * @param {Object} pageData - Page data to save
     * @returns {Object} Save response
     */
    savePageData(pageData) {
        try {
            const savedPages = JSON.parse(localStorage.getItem('dployr_times_pages') || '[]');
            const newPage = {
                id: this.contentGenerator.generateId(),
                ...pageData,
                saved_at: new Date().toISOString()
            };

            savedPages.push(newPage);
            localStorage.setItem('dployr_times_pages', JSON.stringify(savedPages));

            return {
                id: newPage.id,
                success: true,
                message: 'Page saved successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to save page: ' + error.message
            };
        }
    }

    /**
     * Save highlight data (for localStorage in static version)
     * @param {Object} highlightData - Highlight data to save
     * @returns {Object} Save response
     */
    saveHighlight(highlightData) {
        try {
            const savedHighlights = JSON.parse(localStorage.getItem('dployr_times_highlights') || '[]');
            const newHighlight = {
                id: this.contentGenerator.generateId(),
                ...highlightData,
                created_at: new Date().toISOString()
            };

            savedHighlights.push(newHighlight);
            localStorage.setItem('dployr_times_highlights', JSON.stringify(savedHighlights));

            return {
                id: newHighlight.id,
                success: true,
                message: 'Highlight saved successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to save highlight: ' + error.message
            };
        }
    }

    /**
     * Get saved highlights (for localStorage in static version)
     * @returns {Object} Highlights response
     */
    getSavedHighlights() {
        try {
            const highlights = JSON.parse(localStorage.getItem('dployr_times_highlights') || '[]');
            return {
                highlights: highlights.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            };
        } catch (error) {
            return {
                highlights: [],
                error: 'Failed to load highlights: ' + error.message
            };
        }
    }

    /**
     * Clear cache and reset utilities
     */
    reset() {
        this.apiHelpers.clearCache();
        this.isInitialized = false;
    }

    /**
     * Get system status and statistics
     * @returns {Promise<Object>} System status
     */
    async getSystemStatus() {
        return {
            initialized: this.isInitialized,
            cache_stats: this.apiHelpers.getCacheStats(),
            api_health: await this.apiHelpers.getApiHealthStatus(),
            timestamp: new Date().toISOString()
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewspaperUtils;
} else if (typeof window !== 'undefined') {
    window.NewspaperUtils = NewspaperUtils;
}
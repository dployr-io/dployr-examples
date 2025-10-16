/**
 * External API Integration Helpers for Dployr Times
 * Provides fetch wrappers, caching, and fallback mechanisms for external services
 */

class ApiHelpers {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.requestTimeout = 10000; // 10 seconds

        // Fallback images stored locally
        this.fallbackImages = [
            '/shared/images/fallback-1.jpg',
            '/shared/images/fallback-2.jpg',
            '/shared/images/fallback-3.jpg',
            '/shared/images/fallback-4.jpg',
            '/shared/images/fallback-5.jpg'
        ];

        this.fallbackAuthorImages = [
            '/shared/images/author-1.jpg',
            '/shared/images/author-2.jpg',
            '/shared/images/author-3.jpg',
            '/shared/images/author-4.jpg',
            '/shared/images/author-5.jpg'
        ];
    }

    /**
     * Fetch wrapper with timeout and error handling
     * @param {string} url - URL to fetch
     * @param {Object} options - Fetch options
     * @returns {Promise<Response>} Fetch response
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Get cached data or fetch new data
     * @param {string} key - Cache key
     * @param {Function} fetchFunction - Function to fetch data if not cached
     * @returns {Promise<*>} Cached or fetched data
     */
    async getCachedOrFetch(key, fetchFunction) {
        const cached = this.getFromCache(key);
        if (cached) {
            return cached;
        }

        try {
            const data = await fetchFunction();
            this.setCache(key, data);
            return data;
        } catch (error) {
            console.warn(`Failed to fetch data for key ${key}:`, error);
            throw error;
        }
    }

    /**
     * Set data in cache with timestamp
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Get data from cache if not expired
     * @param {string} key - Cache key
     * @returns {*|null} Cached data or null if expired/not found
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) {
            return null;
        }

        const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    /**
     * Clear expired cache entries
     */
    clearExpiredCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.cacheTimeout) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Fetch image from picsum.photos with fallback
     * @param {number} width - Image width
     * @param {number} height - Image height
     * @param {number} seed - Random seed for consistent images
     * @returns {Promise<string>} Image URL (external or fallback)
     */
    async fetchPicsumImage(width = 400, height = 300, seed = null) {
        const actualSeed = seed || Math.floor(Math.random() * 1000);
        const url = `https://picsum.photos/${width}/${height}?random=${actualSeed}`;
        const cacheKey = `picsum_${width}_${height}_${actualSeed}`;

        try {
            return await this.getCachedOrFetch(cacheKey, async () => {
                const response = await this.fetchWithTimeout(url, { method: 'HEAD' });
                if (response.ok) {
                    return url;
                }
                throw new Error(`Picsum API returned ${response.status}`);
            });
        } catch (error) {
            console.warn('Picsum API failed, using fallback image:', error);
            return this.getFallbackImage();
        }
    }

    /**
     * Fetch author image from thispersondoesnotexist.com with fallback
     * @param {number} seed - Random seed for consistent images
     * @returns {Promise<string>} Author image URL (external or fallback)
     */
    async fetchAuthorImage(seed = null) {
        const actualSeed = seed || Math.floor(Math.random() * 100000);
        const url = `https://thispersondoesnotexist.com/image?${actualSeed}`;
        const cacheKey = `author_${actualSeed}`;

        try {
            return await this.getCachedOrFetch(cacheKey, async () => {
                const response = await this.fetchWithTimeout(url, { method: 'HEAD' });
                if (response.ok) {
                    return url;
                }
                throw new Error(`ThisPersonDoesNotExist API returned ${response.status}`);
            });
        } catch (error) {
            console.warn('ThisPersonDoesNotExist API failed, using fallback image:', error);
            return this.getFallbackAuthorImage();
        }
    }

    /**
     * Batch fetch multiple images with error handling
     * @param {Array<Object>} imageRequests - Array of {type, width, height, seed}
     * @returns {Promise<Array<string>>} Array of image URLs
     */
    async batchFetchImages(imageRequests) {
        const promises = imageRequests.map(async (request) => {
            try {
                if (request.type === 'author') {
                    return await this.fetchAuthorImage(request.seed);
                } else {
                    return await this.fetchPicsumImage(request.width, request.height, request.seed);
                }
            } catch (error) {
                console.warn('Image fetch failed in batch:', error);
                return request.type === 'author' ? this.getFallbackAuthorImage() : this.getFallbackImage();
            }
        });

        return Promise.all(promises);
    }

    /**
     * Get a random fallback image
     * @returns {string} Fallback image path
     */
    getFallbackImage() {
        return this.fallbackImages[Math.floor(Math.random() * this.fallbackImages.length)];
    }

    /**
     * Get a random fallback author image
     * @returns {string} Fallback author image path
     */
    getFallbackAuthorImage() {
        return this.fallbackAuthorImages[Math.floor(Math.random() * this.fallbackAuthorImages.length)];
    }

    /**
     * Test external API availability
     * @param {string} service - Service name ('picsum' or 'thispersondoesnotexist')
     * @returns {Promise<boolean>} True if service is available
     */
    async testApiAvailability(service) {
        const urls = {
            picsum: 'https://picsum.photos/100/100?random=1',
            thispersondoesnotexist: 'https://thispersondoesnotexist.com/image?1'
        };

        const url = urls[service];
        if (!url) {
            return false;
        }

        try {
            const response = await this.fetchWithTimeout(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get API health status for all external services
     * @returns {Promise<Object>} Health status object
     */
    async getApiHealthStatus() {
        const [picsumStatus, authorStatus] = await Promise.allSettled([
            this.testApiAvailability('picsum'),
            this.testApiAvailability('thispersondoesnotexist')
        ]);

        return {
            picsum: picsumStatus.status === 'fulfilled' ? picsumStatus.value : false,
            thispersondoesnotexist: authorStatus.status === 'fulfilled' ? authorStatus.value : false,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Preload fallback images to ensure they're available
     * @returns {Promise<void>}
     */
    async preloadFallbackImages() {
        const allFallbacks = [...this.fallbackImages, ...this.fallbackAuthorImages];

        const preloadPromises = allFallbacks.map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = src;
            });
        });

        const results = await Promise.all(preloadPromises);
        const successCount = results.filter(Boolean).length;

        console.log(`Preloaded ${successCount}/${allFallbacks.length} fallback images`);
    }

    /**
     * Generate fallback content when all external services fail
     * @returns {Object} Fallback content object
     */
    generateFallbackContent() {
        return {
            headline: "Local News: Community Events Continue Despite Technical Difficulties",
            image: this.getFallbackImage(),
            author_image: this.getFallbackAuthorImage(),
            body: "We're experiencing some technical difficulties with our content generation services. Please check back later for the latest news and updates. In the meantime, we appreciate your patience as we work to restore full functionality.",
            category: "Technical",
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Retry mechanism for failed requests
     * @param {Function} operation - Operation to retry
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} delay - Delay between retries in ms
     * @returns {Promise<*>} Operation result
     */
    async retryOperation(operation, maxRetries = 3, delay = 1000) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;

                if (attempt === maxRetries) {
                    break;
                }

                console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }

        throw lastError;
    }

    /**
     * Clear all cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            totalMemory: JSON.stringify(Array.from(this.cache.values())).length
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiHelpers;
} else if (typeof window !== 'undefined') {
    window.ApiHelpers = ApiHelpers;
}
/**
 * LocalStorage-based storage system for Static Dployr Times
 * Implements save and highlight functionality using browser localStorage
 */

class LocalStorage {
    constructor() {
        this.STORAGE_KEYS = {
            SAVED_PAGES: 'dployr_times_pages',
            HIGHLIGHTS: 'dployr_times_highlights',
            ARTICLE_CACHE: 'dployr_times_cache'
        };
    }

    /**
     * Save a page to localStorage
     * @param {Object} pageData - Page data to save
     * @returns {Object} Save result with ID
     */
    savePage(pageData) {
        try {
            const pages = this.getSavedPages();
            const pageId = this.generateId();

            const savedPage = {
                id: pageId,
                headline: pageData.headline || 'Untitled Page',
                content: pageData.content || '',
                url: window.location.href,
                created_at: new Date().toISOString(),
                metadata: pageData.metadata || {}
            };

            pages.push(savedPage);
            localStorage.setItem(this.STORAGE_KEYS.SAVED_PAGES, JSON.stringify(pages));

            return { id: pageId, success: true };
        } catch (error) {
            console.error('Error saving page:', error);
            throw new Error('Failed to save page to localStorage');
        }
    }

    /**
     * Get all saved pages
     * @returns {Array} Array of saved pages
     */
    getSavedPages() {
        try {
            const pages = localStorage.getItem(this.STORAGE_KEYS.SAVED_PAGES);
            return pages ? JSON.parse(pages) : [];
        } catch (error) {
            console.error('Error retrieving saved pages:', error);
            return [];
        }
    }

    /**
     * Save a highlight to localStorage
     * @param {Object} highlightData - Highlight data to save
     * @returns {Object} Save result with ID
     */
    saveHighlight(highlightData) {
        try {
            const highlights = this.getHighlights();
            const highlightId = this.generateId();

            const savedHighlight = {
                id: highlightId,
                text: highlightData.text || '',
                page_url: highlightData.page_url || window.location.href,
                created_at: new Date().toISOString(),
                position_data: highlightData.position_data || null,
                context: highlightData.context || ''
            };

            highlights.push(savedHighlight);
            localStorage.setItem(this.STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));

            return { id: highlightId, success: true };
        } catch (error) {
            console.error('Error saving highlight:', error);
            throw new Error('Failed to save highlight to localStorage');
        }
    }

    /**
     * Get all highlights
     * @returns {Array} Array of saved highlights
     */
    getHighlights() {
        try {
            const highlights = localStorage.getItem(this.STORAGE_KEYS.HIGHLIGHTS);
            return highlights ? JSON.parse(highlights) : [];
        } catch (error) {
            console.error('Error retrieving highlights:', error);
            return [];
        }
    }

    /**
     * Delete a highlight by ID
     * @param {string} highlightId - ID of highlight to delete
     * @returns {boolean} Success status
     */
    deleteHighlight(highlightId) {
        try {
            const highlights = this.getHighlights();
            const filteredHighlights = highlights.filter(h => h.id !== highlightId);
            localStorage.setItem(this.STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(filteredHighlights));
            return true;
        } catch (error) {
            console.error('Error deleting highlight:', error);
            return false;
        }
    }

    /**
     * Delete a saved page by ID
     * @param {string} pageId - ID of page to delete
     * @returns {boolean} Success status
     */
    deletePage(pageId) {
        try {
            const pages = this.getSavedPages();
            const filteredPages = pages.filter(p => p.id !== pageId);
            localStorage.setItem(this.STORAGE_KEYS.SAVED_PAGES, JSON.stringify(filteredPages));
            return true;
        } catch (error) {
            console.error('Error deleting page:', error);
            return false;
        }
    }

    /**
     * Cache article data for performance
     * @param {Array} articles - Articles to cache
     * @param {number} ttl - Time to live in milliseconds (default: 1 hour)
     */
    cacheArticles(articles, ttl = 3600000) {
        try {
            const cache = {
                articles: articles,
                cached_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + ttl).toISOString()
            };
            localStorage.setItem(this.STORAGE_KEYS.ARTICLE_CACHE, JSON.stringify(cache));
        } catch (error) {
            console.error('Error caching articles:', error);
        }
    }

    /**
     * Get cached articles if not expired
     * @returns {Array|null} Cached articles or null if expired/not found
     */
    getCachedArticles() {
        try {
            const cache = localStorage.getItem(this.STORAGE_KEYS.ARTICLE_CACHE);
            if (!cache) return null;

            const cacheData = JSON.parse(cache);
            const now = new Date();
            const expiresAt = new Date(cacheData.expires_at);

            if (now > expiresAt) {
                // Cache expired, remove it
                localStorage.removeItem(this.STORAGE_KEYS.ARTICLE_CACHE);
                return null;
            }

            return cacheData.articles;
        } catch (error) {
            console.error('Error retrieving cached articles:', error);
            return null;
        }
    }

    /**
     * Clear all stored data
     */
    clearAll() {
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    /**
     * Get storage usage statistics
     * @returns {Object} Storage statistics
     */
    getStorageStats() {
        try {
            const pages = this.getSavedPages();
            const highlights = this.getHighlights();
            const cache = this.getCachedArticles();

            return {
                pages_count: pages.length,
                highlights_count: highlights.length,
                cache_exists: !!cache,
                total_size: this.calculateStorageSize(),
                last_updated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting storage stats:', error);
            return {
                pages_count: 0,
                highlights_count: 0,
                cache_exists: false,
                total_size: 0,
                error: error.message
            };
        }
    }

    /**
     * Calculate approximate storage size in bytes
     * @returns {number} Storage size in bytes
     */
    calculateStorageSize() {
        let totalSize = 0;
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    totalSize += new Blob([item]).size;
                }
            });
        } catch (error) {
            console.error('Error calculating storage size:', error);
        }
        return totalSize;
    }

    /**
     * Generate a unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**
     * Export all data for backup
     * @returns {Object} All stored data
     */
    exportData() {
        try {
            return {
                pages: this.getSavedPages(),
                highlights: this.getHighlights(),
                cache: this.getCachedArticles(),
                exported_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    }

    /**
     * Import data from backup
     * @param {Object} data - Data to import
     * @returns {boolean} Success status
     */
    importData(data) {
        try {
            if (data.pages) {
                localStorage.setItem(this.STORAGE_KEYS.SAVED_PAGES, JSON.stringify(data.pages));
            }
            if (data.highlights) {
                localStorage.setItem(this.STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(data.highlights));
            }
            if (data.cache) {
                this.cacheArticles(data.cache);
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.LocalStorage = LocalStorage;
}
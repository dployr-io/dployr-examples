/**
 * Main Application for Static Dployr Times
 * Coordinates content generation, API mocking, and user interactions
 */

class StaticNewspaperApp {
    constructor() {
        this.api = new StaticAPI();
        this.storage = new LocalStorage();
        this.highlightingSystem = null;
        this.currentContent = null;
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.setCurrentDate();
            this.setupEventListeners();
            await this.loadContent();
            this.initializeHighlighting();
            this.updateStorageStats();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to initialize application');
        }
    }

    /**
     * Set the current date in the header
     */
    setCurrentDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadContent());
        }

        // Save page button
        const savePageBtn = document.getElementById('save-page-btn');
        if (savePageBtn) {
            savePageBtn.addEventListener('click', () => this.savePage());
        }

        // Clear highlights button
        const clearHighlightsBtn = document.getElementById('clear-highlights-btn');
        if (clearHighlightsBtn) {
            clearHighlightsBtn.addEventListener('click', () => {
                if (this.highlightingSystem) {
                    this.highlightingSystem.clearAllHighlights();
                }
            });
        }

        // Export data button
        const exportDataBtn = document.getElementById('export-data-btn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }

        // Help button
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showHelp());
        }

        // Handle image loading errors
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.loadContent();
                        break;
                    case 's':
                        e.preventDefault();
                        this.savePage();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportData();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showHelp();
                        break;
                }
            }

            // ESC key to clear selection
            if (e.key === 'Escape') {
                window.getSelection().removeAllRanges();
            }
        });
    }

    /**
     * Load content using the static API
     */
    async loadContent() {
        this.showLoading(true);

        try {
            // Check for cached content first
            const cachedContent = this.storage.getCachedArticles();

            if (cachedContent && Math.random() > 0.3) {
                // Use cached content 70% of the time to improve performance
                this.currentContent = cachedContent;
                this.renderContent(cachedContent);
            } else {
                // Generate new content
                const content = await this.api.generate();
                this.currentContent = content;
                this.renderContent(content);

                // Cache the new content
                if (content.success) {
                    this.storage.cacheArticles(content);
                }
            }

            this.updateGenerationTime();
            this.showFeedback('Content loaded successfully!');

        } catch (error) {
            console.error('Error loading content:', error);
            this.showError('Failed to load content. Using fallback.');

            // Use fallback content
            const fallbackContent = this.api.getFallbackContent();
            this.currentContent = fallbackContent;
            this.renderContent(fallbackContent);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Render content to the page
     * @param {Object} content - Content object from API
     */
    renderContent(content) {
        try {
            // Render hero section
            if (content.hero) {
                this.renderHero(content.hero);
            }

            // Render articles
            if (content.articles && content.articles.length > 0) {
                this.renderArticles(content.articles);
            }

            // Render sidebar content
            if (content.sidebar) {
                this.renderSidebar(content.sidebar);
            }

        } catch (error) {
            console.error('Error rendering content:', error);
            this.showError('Failed to render content');
        }
    }

    /**
     * Render hero section
     * @param {Object} hero - Hero content object
     */
    renderHero(hero) {
        const heroHeadline = document.getElementById('hero-headline');
        const heroSubtext = document.getElementById('hero-subtext');
        const heroImage = document.getElementById('hero-image');

        if (heroHeadline) heroHeadline.textContent = hero.title;
        if (heroSubtext) heroSubtext.textContent = hero.body;
        if (heroImage) {
            heroImage.src = hero.image;
            heroImage.alt = hero.title;
        }
    }

    /**
     * Render articles grid
     * @param {Array} articles - Array of article objects
     */
    renderArticles(articles) {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;

        grid.innerHTML = '';

        articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            grid.appendChild(articleElement);
        });
    }

    /**
     * Create an article element
     * @param {Object} article - Article object
     * @returns {Element} Article DOM element
     */
    createArticleElement(article) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article-card';
        articleDiv.innerHTML = `
            <img class="article-image" src="${article.image}" alt="${article.title}" />
            <h3 class="article-title">${article.title}</h3>
            <div class="article-meta">
                <img class="author-image" src="${article.author_image}" alt="Author" />
                <span>By Staff Reporter</span>
                <span>•</span>
                <span>${this.formatTime(article.timestamp)}</span>
                ${article.category ? `<span>•</span><span>${article.category}</span>` : ''}
            </div>
            <p class="article-body">${article.body}</p>
        `;
        return articleDiv;
    }

    /**
     * Render sidebar content
     * @param {Object} sidebar - Sidebar content object
     */
    renderSidebar(sidebar) {
        // Render facts
        if (sidebar.facts) {
            const factsContent = document.getElementById('facts-content');
            if (factsContent) {
                factsContent.innerHTML = sidebar.facts
                    .map(fact => `<div class="sidebar-item">${fact}</div>`)
                    .join('');
            }
        }

        // Render classifieds
        if (sidebar.classifieds) {
            const classifiedsContent = document.getElementById('classifieds-content');
            if (classifiedsContent) {
                classifiedsContent.innerHTML = sidebar.classifieds
                    .map(ad => `<div class="sidebar-item">${ad}</div>`)
                    .join('');
            }
        }
    }

    /**
     * Save the current page
     */
    async savePage() {
        if (!this.currentContent) {
            this.showError('No content to save');
            return;
        }

        try {
            const pageData = {
                headline: this.currentContent.hero ? this.currentContent.hero.title : 'Dployr Times Page',
                content: this.getPageContent(),
                metadata: {
                    articles_count: this.currentContent.articles ? this.currentContent.articles.length : 0,
                    generated_at: this.currentContent.generated_at,
                    page_type: 'newspaper'
                }
            };

            const result = await this.api.save(pageData);

            if (result.success) {
                this.showFeedback('Page saved successfully!');
                this.updateStorageStats();
            } else {
                this.showError('Failed to save page: ' + result.message);
            }

        } catch (error) {
            console.error('Error saving page:', error);
            this.showError('Failed to save page');
        }
    }

    /**
     * Get the current page content as text
     * @returns {string} Page content
     */
    getPageContent() {
        try {
            let content = '';

            // Add hero content
            const heroHeadline = document.getElementById('hero-headline');
            const heroSubtext = document.getElementById('hero-subtext');

            if (heroHeadline) content += heroHeadline.textContent + '\n\n';
            if (heroSubtext) content += heroSubtext.textContent + '\n\n';

            // Add articles
            const articles = document.querySelectorAll('.article-card');
            articles.forEach(article => {
                const title = article.querySelector('.article-title');
                const body = article.querySelector('.article-body');

                if (title) content += title.textContent + '\n';
                if (body) content += body.textContent + '\n\n';
            });

            return content;

        } catch (error) {
            console.error('Error getting page content:', error);
            return 'Error retrieving page content';
        }
    }

    /**
     * Initialize highlighting system
     */
    initializeHighlighting() {
        try {
            this.highlightingSystem = new HighlightingSystem();
            window.highlightingSystem = this.highlightingSystem; // Make globally available
        } catch (error) {
            console.error('Error initializing highlighting system:', error);
        }
    }

    /**
     * Update storage statistics
     */
    updateStorageStats() {
        try {
            const stats = this.storage.getStorageStats();
            console.log('Storage Stats:', stats);

            // Display stats in footer
            const storageStatsElement = document.getElementById('storage-stats');
            if (storageStatsElement) {
                const sizeKB = Math.round(stats.total_size / 1024);
                storageStatsElement.textContent =
                    `Storage: ${stats.pages_count} pages, ${stats.highlights_count} highlights (${sizeKB}KB)`;
            }
        } catch (error) {
            console.error('Error updating storage stats:', error);
            const storageStatsElement = document.getElementById('storage-stats');
            if (storageStatsElement) {
                storageStatsElement.textContent = 'Storage: Error loading stats';
            }
        }
    }

    /**
     * Format timestamp for display
     * @param {string} timestamp - ISO timestamp
     * @returns {string} Formatted time
     */
    formatTime(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            return 'Unknown time';
        }
    }

    /**
     * Update generation time in footer
     */
    updateGenerationTime() {
        const generationTime = document.getElementById('generation-time');
        if (generationTime) {
            const now = new Date();
            generationTime.textContent = `Last updated: ${now.toLocaleTimeString()}`;
        }
    }

    /**
     * Show/hide loading overlay
     * @param {boolean} show - Whether to show loading
     */
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Show feedback message
     * @param {string} message - Message to show
     * @param {string} type - Message type
     */
    showFeedback(message, type = 'success') {
        this.showToast(message, type);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showToast(message, 'error');
        console.error(message);
    }

    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Toast type ('success', 'error', 'info')
     */
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-family: var(--font-family);
            font-size: 0.9rem;
            z-index: 1002;
            max-width: 300px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateX(100%);
        `;

        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };
        toast.style.backgroundColor = colors[type] || colors.info;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Auto-hide after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    /**
     * Handle image loading errors with fallbacks
     * @param {Element} img - Image element that failed to load
     */
    handleImageError(img) {
        if (img.dataset.fallbackAttempted) {
            // Already tried fallback, use final placeholder
            img.src = this.createPlaceholderImage(img.width || 400, img.height || 300);
            return;
        }

        img.dataset.fallbackAttempted = 'true';

        if (img.src.includes('picsum.photos')) {
            // Try different picsum image
            const newSeed = Math.floor(Math.random() * 1000);
            img.src = `https://picsum.photos/${img.width || 400}/${img.height || 300}?random=${newSeed}`;
        } else if (img.src.includes('thispersondoesnotexist.com')) {
            // Use placeholder for author images
            img.src = this.createAvatarPlaceholder();
        } else {
            // Use generic placeholder
            img.src = this.createPlaceholderImage(img.width || 400, img.height || 300);
        }
    }

    /**
     * Create a placeholder image data URL
     * @param {number} width - Image width
     * @param {number} height - Image height
     * @returns {string} Data URL for placeholder image
     */
    createPlaceholderImage(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw placeholder
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Image Not Available', width / 2, height / 2);

        return canvas.toDataURL();
    }

    /**
     * Create an avatar placeholder
     * @returns {string} Data URL for avatar placeholder
     */
    createAvatarPlaceholder() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNEREQiLz4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxMiIgcj0iNSIgZmlsbD0iIzk5OSIvPgo8cGF0aCBkPSJNNSAyNUM1IDIwIDkgMTcgMTUgMTdTMjUgMjAgMjUgMjVIMTVINVoiIGZpbGw9IiM5OTkiLz4KPC9zdmc+';
    }

    /**
     * Export all data as JSON file
     */
    exportData() {
        try {
            const data = this.storage.exportData();
            if (!data) {
                this.showError('No data to export');
                return;
            }

            // Create downloadable JSON file
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `dployr-times-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            URL.revokeObjectURL(url);

            this.showFeedback('Data exported successfully!');

        } catch (error) {
            console.error('Error exporting data:', error);
            this.showError('Failed to export data');
        }
    }

    /**
     * Show help modal with keyboard shortcuts and usage instructions
     */
    showHelp() {
        const helpModal = document.createElement('div');
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-family);
        `;

        helpModal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 8px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            ">
                <h2 style="margin-top: 0; color: var(--accent-color);">🗞️ Dployr Times Help</h2>
                
                <h3>Keyboard Shortcuts</h3>
                <ul style="line-height: 1.8;">
                    <li><strong>Ctrl+R</strong> - Generate new content</li>
                    <li><strong>Ctrl+S</strong> - Save current page</li>
                    <li><strong>Ctrl+E</strong> - Export data</li>
                    <li><strong>Ctrl+H</strong> - Show this help</li>
                    <li><strong>Esc</strong> - Clear text selection</li>
                </ul>

                <h3>Text Highlighting</h3>
                <ul style="line-height: 1.8;">
                    <li>Select any text to highlight it</li>
                    <li>Click on highlights to remove them</li>
                    <li>View saved highlights in "My Notes"</li>
                    <li>Highlights persist between sessions</li>
                </ul>

                <h3>Features</h3>
                <ul style="line-height: 1.8;">
                    <li>Generate random newspaper content</li>
                    <li>Save pages to localStorage</li>
                    <li>Export/import your data</li>
                    <li>Fully offline capable</li>
                </ul>

                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="
                                background: var(--accent-color);
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-family: var(--font-family);
                            ">Close</button>
                </div>
            </div>
        `;

        // Close on background click
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        });

        document.body.appendChild(helpModal);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    try {
        window.staticNewspaperApp = new StaticNewspaperApp();
        console.log('Static Dployr Times application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Static Dployr Times application:', error);
    }
});
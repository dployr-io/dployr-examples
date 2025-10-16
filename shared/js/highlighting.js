/**
 * Dployr Times - Text Highlighting Utilities
 * Provides functionality for text highlighting and note-taking
 */

class HighlightManager {
    constructor(storageKey = 'dployr_times_highlights') {
        this.storageKey = storageKey;
        this.highlights = this.loadHighlights();
        this.isSelecting = false;
        this.init();
    }

    /**
     * Initialize highlighting functionality
     */
    init() {
        this.setupEventListeners();
        this.restoreHighlights();
    }

    /**
     * Set up event listeners for text selection and highlighting
     */
    setupEventListeners() {
        // Listen for text selection
        document.addEventListener('mouseup', (e) => {
            this.handleTextSelection(e);
        });

        // Listen for clicks on existing highlights
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('highlight')) {
                this.handleHighlightClick(e);
            }
        });

        // Prevent highlighting in certain areas
        document.addEventListener('selectstart', (e) => {
            const excludedElements = ['INPUT', 'TEXTAREA', 'BUTTON', 'A'];
            if (excludedElements.includes(e.target.tagName)) {
                return;
            }
        });
    }

    /**
     * Handle text selection events
     */
    handleTextSelection(e) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0 && selectedText.length < 500) {
            // Only highlight reasonable amounts of text
            const range = selection.getRangeAt(0);
            const container = this.findHighlightableContainer(range.commonAncestorContainer);

            if (container && this.isHighlightable(container)) {
                this.createHighlight(selectedText, range, container);
                selection.removeAllRanges();
            }
        }
    }

    /**
     * Create a new highlight
     */
    createHighlight(text, range, container) {
        const highlightId = this.generateHighlightId();
        const highlight = {
            id: highlightId,
            text: text,
            page_url: window.location.href,
            created_at: new Date().toISOString(),
            container_id: container.id || container.className || 'unknown'
        };

        // Wrap the selected text in a highlight span
        try {
            const span = document.createElement('span');
            span.className = 'highlight';
            span.setAttribute('data-highlight-id', highlightId);
            span.title = 'Click to remove highlight';

            range.surroundContents(span);

            // Save the highlight
            this.highlights.push(highlight);
            this.saveHighlights();

            // Update the notes section
            this.updateNotesSection();

            console.log('Highlight created:', highlight);
        } catch (error) {
            console.warn('Could not create highlight:', error);
        }
    }

    /**
     * Handle clicks on existing highlights
     */
    handleHighlightClick(e) {
        e.preventDefault();
        const highlightId = e.target.getAttribute('data-highlight-id');

        if (confirm('Remove this highlight?')) {
            this.removeHighlight(highlightId);
        }
    }

    /**
     * Remove a highlight
     */
    removeHighlight(highlightId) {
        // Remove from DOM
        const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`);
        if (highlightElement) {
            const parent = highlightElement.parentNode;
            parent.replaceChild(document.createTextNode(highlightElement.textContent), highlightElement);
            parent.normalize(); // Merge adjacent text nodes
        }

        // Remove from storage
        this.highlights = this.highlights.filter(h => h.id !== highlightId);
        this.saveHighlights();

        // Update the notes section
        this.updateNotesSection();
    }

    /**
     * Find the appropriate container for highlighting
     */
    findHighlightableContainer(node) {
        while (node && node.nodeType !== Node.ELEMENT_NODE) {
            node = node.parentNode;
        }

        while (node) {
            if (this.isHighlightable(node)) {
                return node;
            }
            node = node.parentNode;
        }

        return null;
    }

    /**
     * Check if an element can be highlighted
     */
    isHighlightable(element) {
        const highlightableClasses = [
            'article-body', 'article-title', 'hero-headline',
            'hero-subtext', 'sidebar-item'
        ];

        const nonHighlightableElements = [
            'SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'BUTTON', 'A'
        ];

        if (nonHighlightableElements.includes(element.tagName)) {
            return false;
        }

        return highlightableClasses.some(className =>
            element.classList.contains(className)
        );
    }

    /**
     * Restore highlights from storage
     */
    restoreHighlights() {
        // This is a simplified version - in a real implementation,
        // you'd need to store position information to restore highlights
        // across page reloads. For now, we'll just update the notes section.
        this.updateNotesSection();
    }

    /**
     * Update the "My Notes" section in the sidebar
     */
    updateNotesSection() {
        let notesSection = document.getElementById('my-notes-section');

        if (!notesSection) {
            // Create the notes section if it doesn't exist
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                notesSection = document.createElement('div');
                notesSection.id = 'my-notes-section';
                notesSection.className = 'sidebar-section';
                notesSection.innerHTML = `
          <h3 class="sidebar-title">My Notes</h3>
          <div id="notes-content"></div>
        `;
                sidebar.appendChild(notesSection);
            }
        }

        const notesContent = document.getElementById('notes-content');
        if (notesContent) {
            if (this.highlights.length === 0) {
                notesContent.innerHTML = '<p class="sidebar-item">No highlights yet. Select text to create highlights.</p>';
            } else {
                notesContent.innerHTML = this.highlights
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map(highlight => `
            <div class="saved-highlight" data-highlight-id="${highlight.id}">
              <div class="highlight-text">"${this.truncateText(highlight.text, 100)}"</div>
              <div class="highlight-meta">
                <small>${this.formatDate(highlight.created_at)}</small>
                <button class="remove-highlight" onclick="highlightManager.removeHighlight('${highlight.id}')" style="float: right; background: none; border: none; color: #999; cursor: pointer;">×</button>
              </div>
            </div>
          `).join('');
            }
        }
    }

    /**
     * Save highlights to storage
     */
    saveHighlights() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.highlights));
        } catch (error) {
            console.warn('Could not save highlights to localStorage:', error);
        }
    }

    /**
     * Load highlights from storage
     */
    loadHighlights() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Could not load highlights from localStorage:', error);
            return [];
        }
    }

    /**
     * Generate a unique highlight ID
     */
    generateHighlightId() {
        return 'highlight_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Truncate text for display
     */
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Get all highlights
     */
    getAllHighlights() {
        return this.highlights;
    }

    /**
     * Clear all highlights
     */
    clearAllHighlights() {
        if (confirm('Remove all highlights?')) {
            // Remove from DOM
            document.querySelectorAll('.highlight').forEach(element => {
                const parent = element.parentNode;
                parent.replaceChild(document.createTextNode(element.textContent), element);
                parent.normalize();
            });

            // Clear storage
            this.highlights = [];
            this.saveHighlights();
            this.updateNotesSection();
        }
    }

    /**
     * Export highlights as JSON
     */
    exportHighlights() {
        const data = {
            highlights: this.highlights,
            exported_at: new Date().toISOString(),
            page_url: window.location.href
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dployr-times-highlights.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Page saving functionality
class PageSaver {
    constructor(storageKey = 'dployr_times_pages') {
        this.storageKey = storageKey;
    }

    /**
     * Save the current page
     */
    savePage() {
        const pageData = {
            id: this.generatePageId(),
            headline: document.querySelector('.hero-headline')?.textContent || 'Untitled Page',
            content: this.getPageContent(),
            url: window.location.href,
            created_at: new Date().toISOString()
        };

        try {
            const savedPages = this.getSavedPages();
            savedPages.push(pageData);
            localStorage.setItem(this.storageKey, JSON.stringify(savedPages));

            alert('Page saved successfully!');
            return pageData;
        } catch (error) {
            console.error('Could not save page:', error);
            alert('Failed to save page. Please try again.');
            return null;
        }
    }

    /**
     * Get page content for saving
     */
    getPageContent() {
        const content = {};

        // Get hero content
        const heroHeadline = document.querySelector('.hero-headline');
        const heroSubtext = document.querySelector('.hero-subtext');
        if (heroHeadline) {
            content.hero = {
                headline: heroHeadline.textContent,
                subtext: heroSubtext?.textContent || ''
            };
        }

        // Get articles
        const articles = [];
        document.querySelectorAll('.article-card').forEach(card => {
            const title = card.querySelector('.article-title')?.textContent;
            const body = card.querySelector('.article-body')?.textContent;
            if (title) {
                articles.push({ title, body });
            }
        });
        content.articles = articles;

        return content;
    }

    /**
     * Get all saved pages
     */
    getSavedPages() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Could not load saved pages:', error);
            return [];
        }
    }

    /**
     * Generate a unique page ID
     */
    generatePageId() {
        return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize highlight manager
    window.highlightManager = new HighlightManager();
    window.pageSaver = new PageSaver();

    // Add save page button if it doesn't exist
    const addSaveButton = () => {
        if (!document.getElementById('save-page-btn')) {
            const header = document.querySelector('.newspaper-header');
            if (header) {
                const saveBtn = document.createElement('button');
                saveBtn.id = 'save-page-btn';
                saveBtn.textContent = '💾 Save Page';
                saveBtn.style.cssText = `
          margin-top: 10px;
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #8b8b8b;
          cursor: pointer;
          font-family: inherit;
        `;
                saveBtn.onclick = () => window.pageSaver.savePage();
                header.appendChild(saveBtn);
            }
        }
    };

    // Add the save button after a short delay to ensure DOM is ready
    setTimeout(addSaveButton, 100);
});

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HighlightManager, PageSaver };
} else if (typeof window !== 'undefined') {
    window.HighlightManager = HighlightManager;
    window.PageSaver = PageSaver;
}
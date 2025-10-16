/**
 * Text Highlighting System for Static Dployr Times
 * Implements click-to-highlight functionality with localStorage persistence
 */

class HighlightingSystem {
    constructor() {
        this.storage = new LocalStorage();
        this.activeHighlights = new Map();
        this.isSelecting = false;
        this.init();
    }

    /**
     * Initialize the highlighting system
     */
    init() {
        this.setupEventListeners();
        this.loadExistingHighlights();
    }

    /**
     * Setup event listeners for text selection and highlighting
     */
    setupEventListeners() {
        // Listen for text selection
        document.addEventListener('mouseup', (e) => this.handleTextSelection(e));
        document.addEventListener('touchend', (e) => this.handleTextSelection(e));

        // Listen for clicks on existing highlights
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('highlight-selection')) {
                this.handleHighlightClick(e);
            }
        });

        // Prevent highlighting in certain areas
        document.addEventListener('selectstart', (e) => {
            const excludedElements = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
            if (excludedElements.includes(e.target.tagName)) {
                e.preventDefault();
            }
        });
    }

    /**
     * Handle text selection events
     * @param {Event} e - Mouse or touch event
     */
    handleTextSelection(e) {
        const selection = window.getSelection();

        if (selection.rangeCount === 0 || selection.isCollapsed) {
            return;
        }

        const selectedText = selection.toString().trim();

        if (selectedText.length < 3) {
            // Don't highlight very short selections
            selection.removeAllRanges();
            return;
        }

        // Check if selection is in a valid area (articles, hero content)
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const validContainers = [
            'article-body', 'hero-subtext', 'hero-headline',
            'article-title', 'sidebar-item'
        ];

        let isValidSelection = false;
        let currentElement = container.nodeType === Node.TEXT_NODE ?
            container.parentElement : container;

        while (currentElement && currentElement !== document.body) {
            if (validContainers.some(className =>
                currentElement.classList && currentElement.classList.contains(className))) {
                isValidSelection = true;
                break;
            }
            currentElement = currentElement.parentElement;
        }

        if (!isValidSelection) {
            selection.removeAllRanges();
            return;
        }

        // Create highlight
        this.createHighlight(selection, selectedText);
    }

    /**
     * Create a highlight from selected text
     * @param {Selection} selection - Browser selection object
     * @param {string} selectedText - The selected text
     */
    createHighlight(selection, selectedText) {
        try {
            const range = selection.getRangeAt(0);
            const highlightId = this.storage.generateId();

            // Create highlight element
            const highlightElement = document.createElement('span');
            highlightElement.className = 'highlight-selection';
            highlightElement.setAttribute('data-highlight-id', highlightId);
            highlightElement.title = 'Click to remove highlight';

            // Wrap the selected content
            try {
                range.surroundContents(highlightElement);
            } catch (error) {
                // If surroundContents fails (e.g., selection spans multiple elements),
                // extract and wrap the content
                const contents = range.extractContents();
                highlightElement.appendChild(contents);
                range.insertNode(highlightElement);
            }

            // Get context around the highlight
            const context = this.getHighlightContext(highlightElement);

            // Save highlight to storage
            const highlightData = {
                text: selectedText,
                page_url: window.location.href,
                context: context,
                position_data: {
                    container_class: this.getContainerClass(highlightElement),
                    offset: this.getTextOffset(highlightElement)
                }
            };

            this.storage.saveHighlight(highlightData);
            this.activeHighlights.set(highlightId, highlightData);

            // Clear selection
            selection.removeAllRanges();

            // Update notes section
            this.updateNotesSection();

            // Show feedback
            this.showHighlightFeedback('Highlight saved!');

        } catch (error) {
            console.error('Error creating highlight:', error);
            this.showHighlightFeedback('Failed to create highlight', 'error');
        }
    }

    /**
     * Handle clicks on existing highlights
     * @param {Event} e - Click event
     */
    handleHighlightClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const highlightElement = e.target;
        const highlightId = highlightElement.getAttribute('data-highlight-id');

        if (confirm('Remove this highlight?')) {
            this.removeHighlight(highlightId, highlightElement);
        }
    }

    /**
     * Remove a highlight
     * @param {string} highlightId - ID of highlight to remove
     * @param {Element} highlightElement - DOM element of highlight
     */
    removeHighlight(highlightId, highlightElement) {
        try {
            // Remove from storage
            this.storage.deleteHighlight(highlightId);
            this.activeHighlights.delete(highlightId);

            // Remove from DOM
            const parent = highlightElement.parentNode;
            while (highlightElement.firstChild) {
                parent.insertBefore(highlightElement.firstChild, highlightElement);
            }
            parent.removeChild(highlightElement);

            // Normalize text nodes
            parent.normalize();

            // Update notes section
            this.updateNotesSection();

            this.showHighlightFeedback('Highlight removed');

        } catch (error) {
            console.error('Error removing highlight:', error);
            this.showHighlightFeedback('Failed to remove highlight', 'error');
        }
    }

    /**
     * Load existing highlights from storage
     */
    loadExistingHighlights() {
        try {
            const highlights = this.storage.getHighlights();
            const currentUrl = window.location.href;

            // Filter highlights for current page
            const pageHighlights = highlights.filter(h => h.page_url === currentUrl);

            pageHighlights.forEach(highlight => {
                this.activeHighlights.set(highlight.id, highlight);
            });

            this.updateNotesSection();

        } catch (error) {
            console.error('Error loading existing highlights:', error);
        }
    }

    /**
     * Update the notes section in the sidebar
     */
    updateNotesSection() {
        const notesContent = document.getElementById('notes-content');
        if (!notesContent) return;

        const highlights = Array.from(this.activeHighlights.values());

        if (highlights.length === 0) {
            notesContent.innerHTML = '<div class="sidebar-item">No highlights yet. Select text to create highlights.</div>';
            return;
        }

        const highlightElements = highlights.map(highlight => {
            const date = new Date(highlight.created_at).toLocaleDateString();
            const preview = highlight.text.length > 100 ?
                highlight.text.substring(0, 100) + '...' : highlight.text;

            return `
                <div class="saved-highlight" data-highlight-id="${highlight.id}">
                    <div class="highlight-text">"${preview}"</div>
                    <div class="highlight-meta">
                        <small>Saved on ${date}</small>
                        <button class="remove-highlight-btn" onclick="window.highlightingSystem.removeHighlightById('${highlight.id}')" 
                                style="float: right; background: none; border: none; color: #999; cursor: pointer;">×</button>
                    </div>
                </div>
            `;
        }).join('');

        notesContent.innerHTML = highlightElements;
    }

    /**
     * Remove highlight by ID (called from notes section)
     * @param {string} highlightId - ID of highlight to remove
     */
    removeHighlightById(highlightId) {
        const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`);
        if (highlightElement) {
            this.removeHighlight(highlightId, highlightElement);
        } else {
            // Highlight not found in DOM, just remove from storage
            this.storage.deleteHighlight(highlightId);
            this.activeHighlights.delete(highlightId);
            this.updateNotesSection();
        }
    }

    /**
     * Get context around a highlight
     * @param {Element} highlightElement - The highlight element
     * @returns {string} Context text
     */
    getHighlightContext(highlightElement) {
        try {
            const container = highlightElement.closest('.article-body, .hero-subtext, .sidebar-item');
            if (!container) return '';

            const containerText = container.textContent;
            const highlightText = highlightElement.textContent;
            const highlightIndex = containerText.indexOf(highlightText);

            if (highlightIndex === -1) return '';

            const contextStart = Math.max(0, highlightIndex - 50);
            const contextEnd = Math.min(containerText.length, highlightIndex + highlightText.length + 50);

            return containerText.substring(contextStart, contextEnd);

        } catch (error) {
            console.error('Error getting highlight context:', error);
            return '';
        }
    }

    /**
     * Get the container class for positioning
     * @param {Element} element - The element to check
     * @returns {string} Container class name
     */
    getContainerClass(element) {
        const container = element.closest('.article-body, .hero-subtext, .sidebar-item, .article-title');
        return container ? container.className : '';
    }

    /**
     * Get text offset within container
     * @param {Element} element - The element to check
     * @returns {number} Text offset
     */
    getTextOffset(element) {
        try {
            const container = element.closest('.article-body, .hero-subtext, .sidebar-item');
            if (!container) return 0;

            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let offset = 0;
            let node;

            while (node = walker.nextNode()) {
                if (node.parentElement === element || element.contains(node)) {
                    break;
                }
                offset += node.textContent.length;
            }

            return offset;

        } catch (error) {
            console.error('Error getting text offset:', error);
            return 0;
        }
    }

    /**
     * Show feedback message to user
     * @param {string} message - Message to show
     * @param {string} type - Message type ('success' or 'error')
     */
    showHighlightFeedback(message, type = 'success') {
        // Create or update feedback element
        let feedback = document.getElementById('highlight-feedback');

        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'highlight-feedback';
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 4px;
                color: white;
                font-family: var(--font-family);
                font-size: 0.9rem;
                z-index: 1001;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.style.backgroundColor = type === 'error' ? '#f44336' : '#4CAF50';
        feedback.style.opacity = '1';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Clear all highlights from current page
     */
    clearAllHighlights() {
        if (confirm('Remove all highlights from this page?')) {
            try {
                // Remove from DOM
                const highlightElements = document.querySelectorAll('.highlight-selection');
                highlightElements.forEach(element => {
                    const parent = element.parentNode;
                    while (element.firstChild) {
                        parent.insertBefore(element.firstChild, element);
                    }
                    parent.removeChild(element);
                    parent.normalize();
                });

                // Remove from storage
                const currentUrl = window.location.href;
                const allHighlights = this.storage.getHighlights();
                const otherPageHighlights = allHighlights.filter(h => h.page_url !== currentUrl);

                localStorage.setItem(this.storage.STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(otherPageHighlights));

                // Clear active highlights
                this.activeHighlights.clear();

                // Update notes section
                this.updateNotesSection();

                this.showHighlightFeedback('All highlights cleared');

            } catch (error) {
                console.error('Error clearing highlights:', error);
                this.showHighlightFeedback('Failed to clear highlights', 'error');
            }
        }
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.HighlightingSystem = HighlightingSystem;
}
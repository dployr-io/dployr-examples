/**
 * Content Generation Utilities for Dployr Times
 * Generates random newspaper content including headlines, articles, facts, and classified ads
 */

class ContentGenerator {
    constructor() {
        // Word banks for headline generation
        this.adjectives = [
            'Breaking', 'Shocking', 'Unprecedented', 'Historic', 'Dramatic', 'Surprising',
            'Revolutionary', 'Controversial', 'Mysterious', 'Urgent', 'Critical', 'Major',
            'Exclusive', 'Developing', 'Emergency', 'Spectacular', 'Bizarre', 'Incredible'
        ];

        this.nouns = [
            'Discovery', 'Investigation', 'Announcement', 'Development', 'Crisis', 'Breakthrough',
            'Scandal', 'Revolution', 'Innovation', 'Conspiracy', 'Phenomenon', 'Incident',
            'Achievement', 'Disaster', 'Victory', 'Defeat', 'Alliance', 'Conflict'
        ];

        this.verbs = [
            'Rocks', 'Shakes', 'Transforms', 'Disrupts', 'Challenges', 'Revolutionizes',
            'Threatens', 'Promises', 'Delivers', 'Exposes', 'Reveals', 'Uncovers',
            'Dominates', 'Conquers', 'Inspires', 'Terrifies', 'Amazes', 'Confounds'
        ];

        this.locations = [
            'Silicon Valley', 'Wall Street', 'Washington D.C.', 'New York', 'Los Angeles',
            'London', 'Tokyo', 'Berlin', 'Paris', 'Sydney', 'Toronto', 'Miami',
            'Chicago', 'Boston', 'Seattle', 'Austin', 'Denver', 'Atlanta'
        ];

        this.categories = [
            'Politics', 'Technology', 'Business', 'Sports', 'Entertainment', 'Science',
            'Health', 'Environment', 'Education', 'Travel', 'Food', 'Fashion'
        ];

        // Facts and classified ads templates
        this.facts = [
            'Did you know that octopuses have three hearts?',
            'Honey never spoils - archaeologists have found edible honey in ancient Egyptian tombs.',
            'A group of flamingos is called a "flamboyance".',
            'Bananas are berries, but strawberries aren\'t.',
            'The shortest war in history lasted only 38-45 minutes.',
            'Wombat droppings are cube-shaped.',
            'There are more possible games of chess than atoms in the observable universe.',
            'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.',
            'A single cloud can weigh more than a million pounds.',
            'Sharks have been around longer than trees.'
        ];

        this.classifiedAds = [
            'FOR SALE: Time machine, slightly used. Only went back once. $5,000 OBO.',
            'LOST: My mind. If found, please return immediately. Reward: Sanity.',
            'WANTED: Someone to go back in time with me. Safety not guaranteed.',
            'FREE: Invisible dog. Great personality, house trained.',
            'FOR RENT: Haunted mansion. Ghosts included. No pets allowed (they scare the spirits).',
            'SEEKING: Professional procrastinator. Will interview candidates next week.',
            'FOUND: Keys to success. Owner must identify which door they open.',
            'FOR SALE: Parachute, never opened. Small stain. Best offer.',
            'WANTED: Telekinetic. You know where to find me.',
            'FREE: Advice. Warning: You get what you pay for.'
        ];
    }

    /**
     * Generate a random headline using templates
     * @returns {string} Generated headline
     */
    generateHeadline() {
        const templates = [
            () => `${this.getRandomItem(this.adjectives)} ${this.getRandomItem(this.nouns)} ${this.getRandomItem(this.verbs)} ${this.getRandomItem(this.locations)}`,
            () => `Local ${this.getRandomItem(this.nouns)} ${this.getRandomItem(this.verbs)} ${this.getRandomItem(this.locations)} Community`,
            () => `${this.getRandomItem(this.adjectives)} ${this.getRandomItem(this.categories)} ${this.getRandomItem(this.nouns)} Leaves Experts Baffled`,
            () => `Scientists Discover ${this.getRandomItem(this.adjectives)} ${this.getRandomItem(this.nouns)} in ${this.getRandomItem(this.locations)}`,
            () => `${this.getRandomItem(this.locations)} Mayor Announces ${this.getRandomItem(this.adjectives)} ${this.getRandomItem(this.nouns)}`,
        ];

        const template = this.getRandomItem(templates);
        return template();
    }

    /**
     * Generate random image URL from picsum.photos
     * @param {number} width - Image width (default: 400)
     * @param {number} height - Image height (default: 300)
     * @returns {string} Image URL
     */
    generateImageUrl(width = 400, height = 300) {
        const seed = Math.floor(Math.random() * 1000);
        return `https://picsum.photos/${width}/${height}?random=${seed}`;
    }

    /**
     * Generate random author image URL from thispersondoesnotexist.com
     * @returns {string} Author image URL
     */
    generateAuthorImageUrl() {
        const seed = Math.floor(Math.random() * 100000);
        return `https://thispersondoesnotexist.com/image?${seed}`;
    }

    /**
     * Generate fake news body text with Lorem Ipsum fallback
     * @param {number} paragraphs - Number of paragraphs (default: 3)
     * @returns {string} Generated body text
     */
    generateBodyText(paragraphs = 3) {
        const newsStarters = [
            'In a surprising turn of events,',
            'Local authorities report that',
            'According to recent studies,',
            'Witnesses claim that',
            'Officials have confirmed that',
            'Sources close to the matter reveal',
            'Breaking news indicates that',
            'Experts are saying that'
        ];

        const newsMiddle = [
            'the situation has escalated beyond expectations',
            'community members are rallying together',
            'new evidence has come to light',
            'the impact will be felt for years to come',
            'stakeholders are calling for immediate action',
            'the discovery has shocked researchers',
            'public opinion remains divided on the matter',
            'the investigation is ongoing'
        ];

        const newsEnders = [
            'More details will be released as they become available.',
            'The story continues to develop.',
            'Officials urge the public to remain calm.',
            'Further investigation is expected.',
            'Community leaders are scheduled to meet next week.',
            'The full impact remains to be seen.',
            'Authorities are asking for public assistance.',
            'Updates will follow in the coming days.'
        ];

        const loremIpsum = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
            'Qui officia deserunt mollit anim id est laborum.'
        ];

        let result = [];

        for (let i = 0; i < paragraphs; i++) {
            let paragraph;

            // Try to generate news-like content first
            if (Math.random() > 0.3) { // 70% chance for news-like content
                const starter = this.getRandomItem(newsStarters);
                const middle = this.getRandomItem(newsMiddle);
                const ender = this.getRandomItem(newsEnders);
                paragraph = `${starter} ${middle}. ${ender}`;
            } else {
                // Fallback to Lorem Ipsum
                paragraph = this.getRandomItem(loremIpsum);
            }

            result.push(paragraph);
        }

        return result.join('\n\n');
    }

    /**
     * Generate a random fact
     * @returns {string} Random fact
     */
    generateRandomFact() {
        return this.getRandomItem(this.facts);
    }

    /**
     * Generate a random classified ad
     * @returns {string} Random classified ad
     */
    generateClassifiedAd() {
        return this.getRandomItem(this.classifiedAds);
    }

    /**
     * Generate multiple random facts
     * @param {number} count - Number of facts to generate
     * @returns {Array<string>} Array of random facts
     */
    generateRandomFacts(count = 3) {
        const selectedFacts = [];
        const availableFacts = [...this.facts];

        for (let i = 0; i < Math.min(count, availableFacts.length); i++) {
            const index = Math.floor(Math.random() * availableFacts.length);
            selectedFacts.push(availableFacts.splice(index, 1)[0]);
        }

        return selectedFacts;
    }

    /**
     * Generate multiple random classified ads
     * @param {number} count - Number of ads to generate
     * @returns {Array<string>} Array of random classified ads
     */
    generateClassifiedAds(count = 3) {
        const selectedAds = [];
        const availableAds = [...this.classifiedAds];

        for (let i = 0; i < Math.min(count, availableAds.length); i++) {
            const index = Math.floor(Math.random() * availableAds.length);
            selectedAds.push(availableAds.splice(index, 1)[0]);
        }

        return selectedAds;
    }

    /**
     * Generate a complete article object
     * @returns {Object} Complete article with all properties
     */
    generateArticle() {
        return {
            id: this.generateId(),
            title: this.generateHeadline(),
            image: this.generateImageUrl(),
            author_image: this.generateAuthorImageUrl(),
            body: this.generateBodyText(),
            category: this.getRandomItem(this.categories),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Generate multiple articles
     * @param {number} count - Number of articles to generate (default: 4)
     * @returns {Array<Object>} Array of article objects
     */
    generateArticles(count = 4) {
        const articles = [];
        for (let i = 0; i < count; i++) {
            articles.push(this.generateArticle());
        }
        return articles;
    }

    /**
     * Generate a unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Get random item from array
     * @param {Array} array - Array to select from
     * @returns {*} Random item from array
     */
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Generate random number between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate complete page content for static version
     * @returns {Object} Complete page content object
     */
    generatePageContent() {
        const articleCount = this.getRandomNumber(3, 5);
        const articles = this.generateArticles(articleCount);
        const heroArticle = this.generateArticle();
        const facts = this.generateRandomFacts(4);
        const classifieds = this.generateClassifiedAds(3);

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
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentGenerator;
} else if (typeof window !== 'undefined') {
    window.ContentGenerator = ContentGenerator;
}
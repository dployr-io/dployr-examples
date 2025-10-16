/**
 * Dployr Times - Content Generation Utilities
 * Provides functions for generating random newspaper content
 */

class ContentGenerator {
    constructor() {
        this.headlines = [
            "Breaking: {adjective} {noun} {verb} in {location}",
            "{location} Officials Announce {adjective} {noun} Initiative",
            "Local {noun} {verb} After {adjective} Discovery",
            "{adjective} {noun} Causes Stir in {location}",
            "Experts Predict {adjective} Changes to {noun}",
            "{location} Residents React to {adjective} {noun}",
            "New Study Reveals {adjective} Truth About {noun}",
            "{adjective} {noun} Sparks Debate Among {location} Leaders"
        ];

        this.adjectives = [
            "Revolutionary", "Mysterious", "Unprecedented", "Controversial", "Remarkable",
            "Shocking", "Innovative", "Unexpected", "Dramatic", "Significant",
            "Extraordinary", "Surprising", "Historic", "Groundbreaking", "Unusual"
        ];

        this.nouns = [
            "Technology", "Discovery", "Policy", "Event", "Development", "Research",
            "Initiative", "Program", "Project", "Study", "Investigation", "Report",
            "Announcement", "Decision", "Agreement", "Partnership", "Innovation"
        ];

        this.verbs = [
            "Emerges", "Transforms", "Revolutionizes", "Impacts", "Changes",
            "Influences", "Affects", "Improves", "Challenges", "Disrupts",
            "Advances", "Evolves", "Develops", "Progresses", "Succeeds"
        ];

        this.locations = [
            "Downtown", "City Center", "Local Community", "Regional Area", "Metropolitan District",
            "Urban Center", "Suburban Area", "Business District", "Historic Quarter", "Innovation Hub",
            "Cultural District", "Academic Zone", "Commercial Area", "Residential Sector", "Tech Corridor"
        ];

        this.facts = [
            "Did you know? The average person spends 7 years of their life in meetings.",
            "Fun fact: Honey never spoils. Archaeologists have found edible honey in ancient tombs.",
            "Interesting: A group of flamingos is called a 'flamboyance'.",
            "Amazing: The human brain uses 20% of the body's total energy.",
            "Surprising: Bananas are berries, but strawberries aren't.",
            "Cool fact: A day on Venus is longer than its year.",
            "Did you know? Octopuses have three hearts and blue blood.",
            "Fun fact: The shortest war in history lasted only 38-45 minutes.",
            "Interesting: A shrimp's heart is in its head.",
            "Amazing: There are more possible games of chess than atoms in the universe."
        ];

        this.classifieds = [
            "FOR SALE: Vintage typewriter, barely used. Perfect for aspiring journalists. $50 OBO.",
            "WANTED: Someone to teach my cat to use a computer. Serious inquiries only.",
            "LOST: My sense of direction. If found, please return immediately.",
            "FOR RENT: Cozy apartment with great view of neighbor's garden gnomes.",
            "SERVICES: Professional procrastinator available. Will start tomorrow.",
            "WANTED: Time machine. Prefer recent model with good mileage.",
            "FOR SALE: Dictionary with missing words. Indescribable condition.",
            "SERVICES: Invisible man seeks work. References available upon request.",
            "LOST: Motivation. Last seen Monday morning. Reward if found.",
            "FOR SALE: Parachute. Used once, never opened. Small stain."
        ];

        this.bodyTemplates = [
            "In a {adjective} turn of events, local authorities have confirmed that {details}. The situation has prompted {reaction} from community leaders who describe it as {impact}. Officials expect {outcome} within the coming weeks.",
            "Residents of {location} were {emotion} to learn about {event}. According to {source}, this development represents {significance}. The {authority} has announced plans to {action} in response to growing concerns.",
            "A recent {type} has revealed {finding} that could {consequence}. Experts believe this {discovery} will {effect} the way we understand {subject}. The research team plans to {next_step} their investigation.",
            "Local {organization} announced today that {announcement}. This {adjective} decision comes after months of {process} and is expected to {result}. Community members have expressed {sentiment} about the changes."
        ];
    }

    /**
     * Generate a random headline using templates
     */
    generateHeadline() {
        const template = this.getRandomItem(this.headlines);
        return template
            .replace('{adjective}', this.getRandomItem(this.adjectives))
            .replace('{noun}', this.getRandomItem(this.nouns))
            .replace('{verb}', this.getRandomItem(this.verbs))
            .replace('{location}', this.getRandomItem(this.locations));
    }

    /**
     * Generate random body text for articles
     */
    generateBodyText() {
        const template = this.getRandomItem(this.bodyTemplates);
        const fillers = {
            adjective: this.getRandomItem(this.adjectives).toLowerCase(),
            location: this.getRandomItem(this.locations),
            details: "the situation requires immediate attention and careful consideration",
            reaction: "mixed reactions",
            impact: "both challenging and promising",
            outcome: "significant improvements",
            emotion: "surprised",
            event: "recent developments",
            source: "reliable sources",
            significance: "a major milestone",
            authority: "city council",
            action: "implement new measures",
            type: "comprehensive study",
            finding: "important insights",
            consequence: "change current practices",
            discovery: "breakthrough",
            effect: "fundamentally alter",
            subject: "community development",
            next_step: "expand",
            organization: "planning committee",
            announcement: "new initiatives will be launched",
            process: "careful deliberation",
            result: "benefit all residents",
            sentiment: "cautious optimism"
        };

        let result = template;
        Object.keys(fillers).forEach(key => {
            result = result.replace(new RegExp(`{${key}}`, 'g'), fillers[key]);
        });

        return result;
    }

    /**
     * Generate a random image URL from picsum.photos
     */
    generateImageUrl(width = 400, height = 300, seed = null) {
        const randomSeed = seed || Math.floor(Math.random() * 1000);
        return `https://picsum.photos/${width}/${height}?random=${randomSeed}`;
    }

    /**
     * Generate a random author image URL
     */
    generateAuthorImageUrl(seed = null) {
        const randomSeed = seed || Math.floor(Math.random() * 1000);
        return `https://thispersondoesnotexist.com/image?${randomSeed}`;
    }

    /**
     * Generate a random fact for the sidebar
     */
    generateRandomFact() {
        return this.getRandomItem(this.facts);
    }

    /**
     * Generate a random classified ad
     */
    generateClassifiedAd() {
        return this.getRandomItem(this.classifieds);
    }

    /**
     * Generate a complete article object
     */
    generateArticle(id = null) {
        const articleId = id || this.generateId();
        const seed = this.hashCode(articleId);

        return {
            id: articleId,
            title: this.generateHeadline(),
            image: this.generateImageUrl(400, 300, seed),
            author_image: this.generateAuthorImageUrl(seed),
            body: this.generateBodyText(),
            category: this.getRandomItem(['Politics', 'Technology', 'Sports', 'Culture', 'Business']),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Generate multiple articles
     */
    generateArticles(count = 4) {
        const articles = [];
        for (let i = 0; i < count; i++) {
            articles.push(this.generateArticle());
        }
        return articles;
    }

    /**
     * Generate sidebar content
     */
    generateSidebarContent() {
        return {
            facts: [
                this.generateRandomFact(),
                this.generateRandomFact(),
                this.generateRandomFact()
            ],
            classifieds: [
                this.generateClassifiedAd(),
                this.generateClassifiedAd(),
                this.generateClassifiedAd()
            ]
        };
    }

    /**
     * Generate complete page content
     */
    generatePageContent() {
        const heroArticle = this.generateArticle('hero');
        const articles = this.generateArticles(4);
        const sidebar = this.generateSidebarContent();

        return {
            hero: heroArticle,
            articles: articles,
            sidebar: sidebar,
            generated_at: new Date().toISOString()
        };
    }

    /**
     * Utility: Get random item from array
     */
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Utility: Generate unique ID
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Utility: Generate hash code from string (for consistent seeding)
     */
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % 1000;
    }

    /**
     * Mock API endpoint for static version
     */
    mockApiGenerate() {
        return {
            articles: this.generateArticles(Math.floor(Math.random() * 3) + 3) // 3-5 articles
        };
    }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentGenerator;
} else if (typeof window !== 'undefined') {
    window.ContentGenerator = ContentGenerator;
}
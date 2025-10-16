/**
 * Dployr Times - Shared Utilities
 * Common utility functions used across all implementations
 */

/**
 * API utilities for consistent error handling and response formatting
 */
class ApiUtils {
    /**
     * Standard API response formatter
     */
    static formatResponse(data, success = true, message = null) {
        return {
            success,
            data,
            message,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Standard error response formatter
     */
    static formatError(message, code = 'UNKNOWN_ERROR', details = null) {
        return {
            error: true,
            message,
            code,
            details,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validate article data structure
     */
    static validateArticle(article) {
        const required = ['id', 'title', 'image', 'author_image', 'body', 'timestamp'];
        const missing = required.filter(field => !article[field]);

        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        return true;
    }

    /**
     * Sanitize text content for safe display
     */
    static sanitizeText(text) {
        if (typeof text !== 'string') return '';

        return text
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim()
            .substring(0, 1000); // Limit length
    }

    /**
     * Generate consistent error codes
     */
    static ERROR_CODES = {
        EXTERNAL_API_FAILED: 'EXTERNAL_API_FAILED',
        DATABASE_ERROR: 'DATABASE_ERROR',
        INVALID_REQUEST: 'INVALID_REQUEST',
        RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
        NOT_FOUND: 'NOT_FOUND',
        VALIDATION_ERROR: 'VALIDATION_ERROR'
    };
}

/**
 * Database utilities for consistent schema and operations
 */
class DatabaseUtils {
    /**
     * Standard SQLite schema creation
     */
    static getCreateTablesSQL() {
        return `
      CREATE TABLE IF NOT EXISTS pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        headline TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS highlights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        page_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        position_data TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at);
      CREATE INDEX IF NOT EXISTS idx_highlights_created_at ON highlights(created_at);
      CREATE INDEX IF NOT EXISTS idx_highlights_page_url ON highlights(page_url);
    `;
    }

    /**
     * Validate page data for database insertion
     */
    static validatePageData(data) {
        if (!data.headline || typeof data.headline !== 'string') {
            throw new Error('Invalid headline');
        }

        if (!data.content || typeof data.content !== 'string') {
            throw new Error('Invalid content');
        }

        return {
            headline: ApiUtils.sanitizeText(data.headline),
            content: JSON.stringify(data.content),
            metadata: data.metadata ? JSON.stringify(data.metadata) : null
        };
    }

    /**
     * Validate highlight data for database insertion
     */
    static validateHighlightData(data) {
        if (!data.text || typeof data.text !== 'string') {
            throw new Error('Invalid highlight text');
        }

        if (!data.page_url || typeof data.page_url !== 'string') {
            throw new Error('Invalid page URL');
        }

        return {
            text: ApiUtils.sanitizeText(data.text),
            page_url: data.page_url,
            position_data: data.position_data ? JSON.stringify(data.position_data) : null
        };
    }
}

/**
 * Content validation and formatting utilities
 */
class ContentUtils {
    /**
     * Validate external image URLs
     */
    static isValidImageUrl(url) {
        try {
            const urlObj = new URL(url);
            return ['picsum.photos', 'thispersondoesnotexist.com'].some(domain =>
                urlObj.hostname.includes(domain)
            );
        } catch {
            return false;
        }
    }

    /**
     * Generate fallback image URL
     */
    static getFallbackImageUrl(width = 400, height = 300) {
        return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#F5F5F5"/>
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#999" font-family="Arial" font-size="18">Image Not Available</text>
      </svg>
    `)}`;
    }

    /**
     * Format timestamp for consistent display
     */
    static formatTimestamp(timestamp) {
        try {
            const date = new Date(timestamp);
            return {
                iso: date.toISOString(),
                display: date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                relative: ContentUtils.getRelativeTime(date)
            };
        } catch {
            return {
                iso: new Date().toISOString(),
                display: 'Unknown time',
                relative: 'Recently'
            };
        }
    }

    /**
     * Get relative time description
     */
    static getRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    }

    /**
     * Truncate text with ellipsis
     */
    static truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Generate consistent article categories
     */
    static getRandomCategory() {
        const categories = [
            'Politics', 'Technology', 'Sports', 'Culture', 'Business',
            'Science', 'Health', 'Entertainment', 'World News', 'Local News'
        ];
        return categories[Math.floor(Math.random() * categories.length)];
    }
}

/**
 * Environment and configuration utilities
 */
class ConfigUtils {
    /**
     * Get default server configuration
     */
    static getDefaultConfig() {
        return {
            port: process.env.PORT || 3000,
            host: process.env.HOST || 'localhost',
            dbPath: process.env.DB_PATH || './newspaper.db',
            corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
            rateLimit: {
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 100 // limit each IP to 100 requests per windowMs
            }
        };
    }

    /**
     * Validate environment configuration
     */
    static validateConfig(config) {
        const errors = [];

        if (!config.port || isNaN(config.port) || config.port < 1 || config.port > 65535) {
            errors.push('Invalid port number');
        }

        if (!config.host || typeof config.host !== 'string') {
            errors.push('Invalid host');
        }

        if (!config.dbPath || typeof config.dbPath !== 'string') {
            errors.push('Invalid database path');
        }

        if (errors.length > 0) {
            throw new Error(`Configuration errors: ${errors.join(', ')}`);
        }

        return true;
    }

    /**
     * Get CORS configuration
     */
    static getCorsConfig(origins = null) {
        return {
            origin: origins || ['http://localhost:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        };
    }
}

/**
 * Logging utilities for consistent logging across implementations
 */
class LogUtils {
    /**
     * Log levels
     */
    static LEVELS = {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    };

    /**
     * Format log message
     */
    static formatMessage(level, message, context = {}) {
        return {
            timestamp: new Date().toISOString(),
            level: Object.keys(LogUtils.LEVELS)[level],
            message,
            context,
            service: 'dployr-times'
        };
    }

    /**
     * Log error with context
     */
    static logError(message, error = null, context = {}) {
        const logEntry = LogUtils.formatMessage(LogUtils.LEVELS.ERROR, message, {
            ...context,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : null
        });

        console.error(JSON.stringify(logEntry));
        return logEntry;
    }

    /**
     * Log info message
     */
    static logInfo(message, context = {}) {
        const logEntry = LogUtils.formatMessage(LogUtils.LEVELS.INFO, message, context);
        console.log(JSON.stringify(logEntry));
        return logEntry;
    }

    /**
     * Log debug message
     */
    static logDebug(message, context = {}) {
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
            const logEntry = LogUtils.formatMessage(LogUtils.LEVELS.DEBUG, message, context);
            console.debug(JSON.stringify(logEntry));
            return logEntry;
        }
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ApiUtils,
        DatabaseUtils,
        ContentUtils,
        ConfigUtils,
        LogUtils
    };
} else if (typeof window !== 'undefined') {
    window.DployrUtils = {
        ApiUtils,
        DatabaseUtils,
        ContentUtils,
        ConfigUtils,
        LogUtils
    };
}
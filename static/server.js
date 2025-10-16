/**
 * Simple HTTP Server for Static Dployr Times
 * Serves static files for local development
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class StaticServer {
    constructor(port = 3000) {
        this.port = port;
        this.mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };
    }

    /**
     * Start the server
     */
    start() {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, () => {
            console.log(`🗞️  Static Dployr Times server running at http://localhost:${this.port}`);
            console.log('   Press Ctrl+C to stop the server');
        });

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n📰 Shutting down Static Dployr Times server...');
            server.close(() => {
                console.log('   Server stopped');
                process.exit(0);
            });
        });
    }

    /**
     * Handle incoming requests
     * @param {http.IncomingMessage} req - Request object
     * @param {http.ServerResponse} res - Response object
     */
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname;

        // Default to index.html for root requests
        if (pathname === '/') {
            pathname = '/index.html';
        }

        // Resolve file path
        let filePath = path.join(__dirname, pathname);

        // Security check - prevent directory traversal
        if (!filePath.startsWith(__dirname)) {
            this.sendError(res, 403, 'Forbidden');
            return;
        }

        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Try to serve from shared directory
                const sharedPath = path.join(__dirname, '..', 'shared', pathname.replace('/shared/', ''));
                fs.access(sharedPath, fs.constants.F_OK, (sharedErr) => {
                    if (sharedErr) {
                        this.sendError(res, 404, 'File not found');
                    } else {
                        this.serveFile(sharedPath, res);
                    }
                });
            } else {
                this.serveFile(filePath, res);
            }
        });
    }

    /**
     * Serve a file
     * @param {string} filePath - Path to file
     * @param {http.ServerResponse} res - Response object
     */
    serveFile(filePath, res) {
        const ext = path.extname(filePath);
        const mimeType = this.mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                this.sendError(res, 500, 'Internal Server Error');
                return;
            }

            res.writeHead(200, {
                'Content-Type': mimeType,
                'Content-Length': data.length,
                'Cache-Control': 'no-cache' // Disable caching for development
            });
            res.end(data);
        });
    }

    /**
     * Send error response
     * @param {http.ServerResponse} res - Response object
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     */
    sendError(res, statusCode, message) {
        res.writeHead(statusCode, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error ${statusCode}</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #f44336; }
                </style>
            </head>
            <body>
                <h1>Error ${statusCode}</h1>
                <p>${message}</p>
                <p><a href="/">← Back to Dployr Times</a></p>
            </body>
            </html>
        `);
    }
}

// Start server if this file is run directly
if (require.main === module) {
    const port = process.env.PORT || 3000;
    const server = new StaticServer(port);
    server.start();
}

module.exports = StaticServer;
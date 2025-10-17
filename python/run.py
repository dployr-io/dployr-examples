#!/usr/bin/env python3
"""
Simple startup script for the Old County Times Flask application
"""

import os
import sys

def main():
    """Start the Flask application"""
    print("Starting Old County Times Python Flask server...")
    print("Installing dependencies if needed...")
    
    # Install Flask if not available
    try:
        import flask
        print("✓ Flask is available")
    except ImportError:
        print("Installing Flask...")
        os.system("pip install flask")
    
    # Import and run the app
    from app import app
    
    port = int(os.environ.get('PORT', 3000))
    print(f"Starting server on http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    app.run(host='0.0.0.0', port=port, debug=False)

if __name__ == '__main__':
    main()
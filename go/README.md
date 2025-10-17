# Old County Times - Go Edition

This directory contains the Go version of the Old County Times newspaper application.

## Requirements

- Go 1.19 or later

## Getting Started

1. Navigate to the go directory:
```bash
cd go
```

2. Download dependencies:
```bash
go mod tidy
```

3. Run the application:
```bash
go run main.go
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /` - Main newspaper page
- `GET /api/newsletter-data` - JSON API endpoint for newsletter content

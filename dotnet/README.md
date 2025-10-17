# ASP.NET Core 8 Blazor Implementation

This directory contains the ASP.NET Core 8 Blazor version of the Old County Times newspaper application.

## Requirements

- .NET 8.0 SDK or later

## Getting Started

1. Navigate to the dotnet directory:
   ```bash
   cd dotnet
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

- `GET /` - Main newspaper page (Blazor Server)
- `GET /api/newsletter-data` - JSON API endpoint for newsletter content


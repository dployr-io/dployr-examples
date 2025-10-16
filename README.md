# 🗞️ The Dployr Times Demo Suite

A multi-language web application demonstration showcasing Dployr's deployment capabilities across different technology stacks. This project consists of identical newspaper generator applications built in 8 different frameworks, each implementing the same core functionality and user experience.

## 📁 Project Structure

```
dployr-times-demo-suite/
├── shared/                 # Shared assets used by all implementations
│   ├── css/
│   │   └── newspaper.css   # 1980s newspaper styling
│   ├── js/
│   │   ├── content-generator.js  # Random content generation
│   │   └── highlighting.js       # Text highlighting utilities
│   └── templates/
│       └── newspaper.html        # Common HTML template
├── static/                 # Static HTML/JavaScript implementation
├── nextjs/                 # Next.js implementation
├── node/                   # Node.js Express implementation
├── go/                     # Go implementation
├── php/                    # PHP implementation
├── rails/                  # Ruby on Rails implementation
├── dotnet/                 # ASP.NET Core implementation
├── java/                   # Java Spring Boot implementation
└── README.md              # This file
```

## 🎯 Features

- **Consistent UI/UX**: Identical newspaper layout across all implementations
- **Random Content**: Dynamically generated headlines, articles, and images
- **Interactive Elements**: Text highlighting and note-taking functionality
- **Responsive Design**: Mobile-friendly 1980s newspaper aesthetic
- **Data Persistence**: SQLite database for most implementations, localStorage for static version
- **External APIs**: Integration with picsum.photos and thispersondoesnotexist.com

## 🚀 Technology Implementations

| Framework | Server | Database | Port | Status |
|-----------|--------|----------|------|--------|
| Static HTML/JS | File Server | localStorage | 3000 | 🔄 Planned |
| Next.js | Next.js Server | SQLite + Prisma | 3000 | 🔄 Planned |
| Node.js | Express | SQLite + better-sqlite3 | 3000 | 🔄 Planned |
| Go | net/http | SQLite + modernc.org/sqlite | 3000 | 🔄 Planned |
| PHP | Built-in/Apache | SQLite + PDO | 3000 | 🔄 Planned |
| Ruby on Rails | Rails Server | SQLite + ActiveRecord | 3000 | 🔄 Planned |
| ASP.NET Core | Kestrel | SQLite + Entity Framework | 3000 | 🔄 Planned |
| Java Spring Boot | Spring Boot | SQLite + JPA | 3000 | 🔄 Planned |

## 🎨 Design System

### Color Palette
- Background: `#faf4e1` (Light beige)
- Text: `#2c2c2c` (Dark gray)
- Accent: `#1a1a1a` (Black)
- Borders: `#8b8b8b` (Medium gray)

### Typography
- Font Family: Times New Roman, serif
- Headlines: Bold, various sizes (1.2rem - 2.5rem)
- Body Text: 1rem, line-height 1.6
- Captions: 0.875rem, italic

### Layout Components
- **Header**: Newspaper title and date
- **Hero Section**: Main story with large image
- **Articles Grid**: 3-5 article cards in responsive grid
- **Sidebar**: Random facts, classified ads, and user notes
- **Footer**: Dployr branding and generation timestamp

## 🔧 API Endpoints

All implementations provide the same REST API:

### `GET /api/generate`
Returns randomly generated newspaper content.

**Response:**
```json
{
  "articles": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "author_image": "string", 
      "body": "string",
      "category": "string",
      "timestamp": "string"
    }
  ]
}
```

### `POST /api/save`
Saves page content or highlights.

**Request:**
```json
{
  "type": "page|highlight",
  "content": "string",
  "metadata": {}
}
```

### `GET /api/highlights`
Retrieves saved highlights.

**Response:**
```json
{
  "highlights": [
    {
      "id": "string",
      "text": "string", 
      "page_url": "string",
      "created_at": "string"
    }
  ]
}
```

## 🗄️ Database Schema

```sql
-- Pages table for saved content
CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    headline TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT
);

-- Highlights table for saved text selections  
CREATE TABLE highlights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    page_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    position_data TEXT
);
```

## 🚀 Quick Start

Each implementation directory contains its own README with specific setup instructions. Generally:

1. Navigate to the desired implementation directory
2. Install dependencies (if applicable)
3. Run the application on port 3000
4. Open http://localhost:3000 in your browser

## 🎯 Development Goals

This demo suite demonstrates:

- **Cross-platform deployment** capabilities
- **Consistent user experience** across different tech stacks
- **Minimal dependency** approach for easy deployment
- **Modern web development** patterns and best practices
- **API-first design** with shared frontend assets

## 📝 License

This project is part of the Dployr platform demonstration and is intended for educational and evaluation purposes.

---

**Generated by Dployr** - Showcasing seamless deployment across multiple technology stacks.
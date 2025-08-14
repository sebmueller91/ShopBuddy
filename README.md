# ShopBuddy 🛒

A simple, fun shopping list web application where users can collaboratively add and remove items from a shared shopping list. Perfect for households, roommates, or small teams!

## Features

- ✅ Add items to the shopping list
- ❌ Remove items from the shopping list
- ✔️ Toggle items as completed
- 📱 Mobile-friendly responsive design
- 🎨 Fun and inviting UI (not too professional!)
- 🗄️ Shared SQLite database for all users
- 🐳 Fully containerized with Docker
- ⚡ Built with ASP.NET Core 8.0

## Technology Stack

- **Backend**: ASP.NET Core 8.0 with MVC
- **Database**: SQLite with Entity Framework Core
- **Frontend**: HTML, CSS, JavaScript (with Bootstrap for responsiveness)
- **Containerization**: Docker
- **UI**: Custom CSS with gradients and animations for a friendly look

## Quick Start with Docker

### Option 1: Use Pre-built Images (Recommended)

```bash
# Pull and run the latest image from GitHub Container Registry
docker run -d -p 8080:8080 --name shopbuddy ghcr.io/sebmueller91/shopbuddy:latest
```

### Option 2: Build from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/sebmueller91/ShopBuddy.git
   cd ShopBuddy
   ```

2. Build and run with Docker:
   ```bash
   docker build -t shopbuddy .
   docker run -p 8080:8080 shopbuddy
   ```

3. Open your browser and navigate to `http://localhost:8080`

### 🍓 Raspberry Pi Deployment

ShopBuddy supports ARM64 architecture and can run on Raspberry Pi:

```bash
# Pull and run on Raspberry Pi
docker pull ghcr.io/sebmueller91/shopbuddy:latest
docker run -d \
  --name shopbuddy \
  --restart unless-stopped \
  -p 8080:8080 \
  -v shopbuddy-data:/app/data \
  ghcr.io/sebmueller91/shopbuddy:latest
```

📖 See [RASPBERRY_PI_DEPLOYMENT.md](RASPBERRY_PI_DEPLOYMENT.md) for detailed Pi deployment instructions.

## Development

### Prerequisites
- .NET 8.0 SDK (for local development)
- Docker (for containerization)

### Running locally
```bash
# Clone and navigate to the project
git clone https://github.com/sebmueller91/ShopBuddy.git
cd ShopBuddy

# Use the provided build script
chmod +x build.sh
./build.sh

# Or manually:
dotnet restore
dotnet build
dotnet run
```

The application will be available at `http://localhost:5000` or `https://localhost:5001`.

### Running tests
Tests are integrated into the Docker build process and can be run with:
```bash
dotnet run --project Tests/Tests.csproj
```

### Project Structure
```
ShopBuddy/
├── Controllers/          # MVC Controllers
│   ├── HomeController.cs # Main page controller
│   └── ItemsController.cs# API endpoints for shopping items
├── Data/                 # Database context
│   └── ShopBuddyContext.cs
├── Models/              # Data models
│   └── ShoppingItem.cs
├── Views/               # Razor views
│   ├── Home/
│   └── Shared/
├── wwwroot/             # Static files (CSS, JS)
├── Tests/               # Simple test runner
├── Dockerfile           # Docker configuration
└── build.sh            # Build script
```

## API Endpoints

- `GET /` - Main shopping list page
- `GET /api/items` - Get all shopping list items (JSON)
- `POST /api/items` - Add a new item (JSON)
- `DELETE /api/items/{id}` - Remove an item
- `PUT /api/items/{id}/toggle` - Toggle item completion status

## Features Implemented

✅ **Core Functionality**
- Add new shopping items
- Remove items from the list  
- Toggle items as completed/incomplete
- Real-time updates without page refresh

✅ **User Interface**
- Responsive design for desktop and mobile
- Fun, colorful gradient design
- Smooth animations and transitions
- Bootstrap integration for consistency
- Intuitive icons and visual feedback

✅ **Backend Architecture**
- ASP.NET Core 8.0 MVC pattern
- RESTful API design
- Entity Framework Core with SQLite
- Dependency injection
- Clean separation of concerns

✅ **Deployment & DevOps**
- Complete Docker containerization
- Multi-stage Docker build
- Automated build and test pipeline
- Production-ready configuration

## Docker Features

The Docker setup includes:
- **Multi-architecture support**: AMD64 and ARM64 (Raspberry Pi compatible)
- **Automated builds**: GitHub Actions pipeline builds and publishes images
- **Container Registry**: Images available at `ghcr.io/sebmueller91/shopbuddy`
- Multi-stage build for optimized image size
- Automated dependency restoration
- Build verification
- Test execution during build
- Production environment configuration
- Volume support for database persistence

### Available Tags
- `latest` - Latest stable release from main branch
- `v1.0.0` - Semantic version tags
- `main` - Latest commit from main branch
- `sha-<commit>` - Specific commit builds

## Contributing

Feel free to open issues or submit pull requests!

## License

See LICENSE file for details.
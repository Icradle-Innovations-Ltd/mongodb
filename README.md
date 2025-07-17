# 🗄️ MongoDB API Server

A professional MongoDB REST API server with an interactive dashboard, built with Node.js and Express.js. Features real-time database statistics, collection management, and a modern web interface.

## ✨ Features

- **🚀 Interactive Dashboard** - Modern web interface with real-time statistics
- **📊 Database Statistics** - Live collection counts, document counts, data sizes, and indexes
- **🔍 Real-time Search** - Quick search functionality with instant results
- **🎯 API Explorer** - Interactive endpoint testing directly from the browser
- **📱 Responsive Design** - Mobile-friendly interface with modern UI/UX
- **🏗️ Modular Architecture** - Clean separation of concerns with controllers and routes
- **🔧 Professional Error Handling** - Comprehensive error handling and logging
- **🌐 CORS Support** - Cross-origin resource sharing enabled

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: MVC Pattern with ES6 modules

## 📁 Project Structure

```
mongodb/
├── src/
│   ├── app.js                 # Main application class
│   ├── config/
│   │   └── database.js        # Database connection configuration
│   ├── controllers/
│   │   ├── databaseController.js    # Database operations
│   │   ├── collectionController.js  # Collection management
│   │   └── documentController.js    # Document operations
│   └── routes/
│       ├── databaseRoutes.js        # Database API routes
│       └── collectionRoutes.js      # Collection API routes
├── public/
│   └── index.html            # Interactive dashboard
├── server.js                 # Application entry point
├── package.json             # Dependencies and scripts
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Icradle-Innovations-Ltd/mongodb.git
   cd mongodb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/
   DATABASE_NAME=sample_mflix
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open the dashboard**
   Navigate to `http://localhost:3000` in your browser

## 🔗 API Endpoints

### Database Operations
- `GET /api/stats` - Get database statistics
- `GET /api/collections` - List all collections

### Collection Operations
- `GET /api/collections/:name` - Get collection documents
- `GET /api/collections/:name/search` - Search documents
- `GET /api/collections/:name/schema` - Get collection schema
- `GET /api/collections/:name/stats` - Get collection statistics

### Query Parameters
- `limit` - Limit number of results (default: 10)
- `skip` - Skip number of results (default: 0)
- `q` - Search query for text search

### Example API Calls

```bash
# Get database statistics
curl http://localhost:3000/api/stats

# Search movies
curl "http://localhost:3000/api/collections/movies/search?q=title:Inception&limit=5"

# Get collection schema
curl http://localhost:3000/api/collections/movies/schema
```

## 🎨 Dashboard Features

### Real-time Statistics
- **Collections Count**: Total number of collections
- **Documents Count**: Total documents across all collections
- **Data Size**: Total size of all collections in MB
- **Indexes Count**: Total number of indexes

### Interactive Search
- Real-time movie search with MongoDB query syntax
- Instant results with JSON formatting
- Error handling and user feedback

### API Explorer
- Click-to-test API endpoints
- Live results display
- Organized by operation types

## 🔧 Development

### Available Scripts

```bash
# Start the server
npm start

# Run simple API tests
node test-api.js
```

### Code Style

The project follows modern JavaScript practices:
- ES6 modules
- Async/await patterns
- Clean architecture principles
- Professional error handling

## 📊 Database Schema

The server is configured to work with MongoDB Atlas's sample datasets:

- **movies** - Movie collection with titles, genres, cast, etc.
- **users** - User accounts and profiles
- **comments** - Movie reviews and comments
- **theaters** - Theater locations and information
- **sessions** - User session data

## 🌐 Deployment

### Local Development
```bash
npm start
```

### Production Deployment
1. Set environment variables
2. Configure MongoDB Atlas connection
3. Deploy to your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Data visualization charts
- [ ] Export/import functionality
- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and sorting
- [ ] Bulk operations support

## 🐛 Issues & Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/Icradle-Innovations-Ltd/mongodb/issues) tab
2. Create a new issue if needed
3. Provide detailed information about the problem

## 📧 Contact

**Icradle Innovations Ltd**
- GitHub: [@Icradle-Innovations-Ltd](https://github.com/Icradle-Innovations-Ltd)
- Project: [MongoDB API Server](https://github.com/Icradle-Innovations-Ltd/mongodb)

---

⭐ **Star this repository if you find it helpful!** ⭐
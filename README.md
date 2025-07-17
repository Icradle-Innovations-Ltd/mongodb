# 🗄️ MongoDB API Server

A professional MongoDB REST API server with an interactive dashboard, built with Node.js and Express.js. Features real-time database statistics, collection management, and a modern web interface.

## 🌐 Live Demo

**🚀 [Live Demo]((https://mongodb-ochre.vercel.app/)* - Interactive MongoDB Dashboard

*Note: Replace with your actual deployment URL once deployed*

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

#### Vercel Deployment (Recommended)
1. **Prerequisites**
   - Vercel account
   - GitHub repository connected to Vercel
   - MongoDB Atlas database with IP whitelist configured

2. **Environment Variables**
   Set these in your Vercel dashboard:
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/
   DATABASE_NAME=sample_mflix
   NODE_ENV=production
   ```

3. **Deploy**
   - Push to your main branch
   - Vercel will automatically build and deploy
   - The `vercel.json` configuration handles routing

#### Other Platforms (Heroku, Railway, etc.)
1. **Set environment variables**
2. **Configure MongoDB Atlas connection**
3. **Ensure Node.js version >= 14**
4. **Deploy using platform-specific instructions**

### Deployment Checklist
- [ ] Environment variables configured
- [ ] MongoDB Atlas IP whitelist updated (allow all: 0.0.0.0/0 for production)
- [ ] Database connection string includes credentials
- [ ] NODE_ENV set to "production"
- [ ] Port configuration handled by platform (process.env.PORT)

### Common Deployment Issues
- **404 on API routes**: Ensure `vercel.json` is properly configured
- **Database connection**: Check MongoDB Atlas network access settings
- **Environment variables**: Verify all required env vars are set in deployment platform

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

### Common Issues

#### API Returns 404 or HTML Instead of JSON
- **Solution**: Check if `vercel.json` is properly configured
- **Check**: Ensure environment variables are set correctly
- **Verify**: MongoDB Atlas network access allows your deployment IP

#### Database Connection Errors
- **Solution**: Update MongoDB Atlas network access to allow all IPs (0.0.0.0/0)
- **Check**: Verify DATABASE_URL includes username and password
- **Verify**: Database name matches your MongoDB Atlas database

#### UI Shows "Error" Instead of Data
- **Solution**: Check browser console for detailed error messages
- **Check**: Ensure API endpoints are accessible from deployment URL
- **Verify**: All environment variables are set in deployment platform

### Getting Help

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/Icradle-Innovations-Ltd/mongodb/issues) tab
2. Create a new issue if needed
3. Provide detailed information about the problem:
   - Deployment platform (Vercel, Heroku, etc.)
   - Error messages from browser console
   - Environment setup details

## 📧 Contact

**Icradle Innovations Ltd**
- GitHub: [@Icradle-Innovations-Ltd](https://github.com/Icradle-Innovations-Ltd)
- Project: [MongoDB API Server](https://github.com/Icradle-Innovations-Ltd/mongodb)

---

⭐ **Star this repository if you find it helpful!** ⭐

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import databaseRoutes from './routes/databaseRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';

// Import database connection
import dbConnection from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MongoDBAPIServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // CORS middleware
    this.app.use(cors());
    
    // JSON parsing middleware
    this.app.use(express.json());
    
    // Static file serving
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  setupRoutes() {
    // API routes
    this.app.use('/api', databaseRoutes);
    this.app.use('/api/collections', collectionRoutes);

    // Serve the main HTML file for any other routes
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
      });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  async start() {
    try {
      // Connect to MongoDB
      await dbConnection.connect();
      
      // Start the server
      this.app.listen(this.port, () => {
        console.log(`Server running on http://localhost:${this.port}`);
        console.log(`Database: ${process.env.DATABASE_NAME}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async shutdown() {
    console.log('Shutting down server...');
    await dbConnection.disconnect();
    process.exit(0);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  await dbConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  await dbConnection.disconnect();
  process.exit(0);
});

export default MongoDBAPIServer;

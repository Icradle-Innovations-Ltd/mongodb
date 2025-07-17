import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class DatabaseConnection {
  constructor() {
    this.client = null;
    this.db = null;
    this.uri = process.env.MONGODB_URI;
    this.dbName = process.env.DATABASE_NAME;
  }

  async connect() {
    try {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log('Connected to MongoDB Atlas successfully!');
      return this.db;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB connection closed');
    }
  }

  getDatabase() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  isConnected() {
    return this.client && this.client.topology && this.client.topology.isConnected();
  }
}

// Create a singleton instance
const dbConnection = new DatabaseConnection();

export default dbConnection;

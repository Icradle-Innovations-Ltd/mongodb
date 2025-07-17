import dbConnection from '../config/database.js';

export class DatabaseController {
  /**
   * Get database statistics
   */
  async getStats(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const collections = await db.listCollections().toArray();
      
      const stats = {
        database: process.env.DATABASE_NAME,
        collections: collections.length,
        totalDocuments: 0,
        totalSize: 0,
        totalIndexes: 0,
        collectionsDetails: []
      };
      
      for (const collection of collections) {
        const collectionObj = db.collection(collection.name);
        
        // Get document count
        const count = await collectionObj.countDocuments();
        stats.totalDocuments += count;
        
        // Get collection stats for size information
        let collectionStats = null;
        let indexCount = 0;
        let collectionSize = 0;
        
        try {
          // Try to get collection stats
          collectionStats = await db.command({
            collStats: collection.name
          });
          collectionSize = collectionStats.size || collectionStats.storageSize || 0;
          stats.totalSize += collectionSize;
        } catch (statsError) {
          // If collStats fails, try alternative approach with estimated size
          try {
            const avgDocSize = count > 0 ? await db.collection(collection.name).findOne() : null;
            if (avgDocSize) {
              const estimatedSize = JSON.stringify(avgDocSize).length * count;
              collectionSize = estimatedSize;
              stats.totalSize += estimatedSize;
            }
          } catch (estimateError) {
            console.warn(`Could not estimate size for ${collection.name}:`, estimateError.message);
          }
        }
        
        // Get indexes count
        try {
          const indexes = await collectionObj.indexes();
          indexCount = indexes.length;
          stats.totalIndexes += indexCount;
        } catch (indexError) {
          console.warn(`Could not get indexes for ${collection.name}:`, indexError.message);
        }
        
        stats.collectionsDetails.push({
          name: collection.name,
          count,
          size: collectionSize,
          indexes: indexCount
        });
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

import dbConnection from '../config/database.js';

export class CollectionController {
  /**
   * Get all collections with document counts
   */
  async getAllCollections(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const collections = await db.listCollections().toArray();
      
      const collectionsWithCounts = await Promise.all(
        collections.map(async (collection) => {
          const count = await db.collection(collection.name).countDocuments();
          return {
            name: collection.name,
            count: count
          };
        })
      );
      
      res.json(collectionsWithCounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create a new collection
   */
  async createCollection(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const { name, options } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Collection name is required' });
      }
      
      await db.createCollection(name, options || {});
      res.json({ message: `Collection '${name}' created successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Drop a collection
   */
  async dropCollection(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const { name } = req.params;
      
      await db.collection(name).drop();
      res.json({ message: `Collection '${name}' dropped successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Rename a collection
   */
  async renameCollection(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const { name } = req.params;
      const { newName } = req.body;
      
      if (!newName) {
        return res.status(400).json({ error: 'New collection name is required' });
      }
      
      await db.collection(name).rename(newName);
      res.json({ message: `Collection '${name}' renamed to '${newName}' successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get collection schema/structure
   */
  async getCollectionSchema(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const { name } = req.params;
      
      console.log(`Schema request for collection: ${name}`);
      
      const collection = db.collection(name);
      
      // Get sample documents to analyze structure
      const sampleDocs = await collection.find({}).limit(100).toArray();
      
      if (sampleDocs.length === 0) {
        return res.json({ schema: {}, count: 0 });
      }
      
      const schema = {};
      const typeCount = {};
      
      sampleDocs.forEach(doc => {
        Object.keys(doc).forEach(key => {
          const value = doc[key];
          const type = Array.isArray(value) ? 'array' : typeof value;
          
          if (!schema[key]) {
            schema[key] = { types: new Set(), examples: [] };
          }
          
          schema[key].types.add(type);
          if (schema[key].examples.length < 3) {
            schema[key].examples.push(value);
          }
          
          typeCount[key] = typeCount[key] || {};
          typeCount[key][type] = (typeCount[key][type] || 0) + 1;
        });
      });
      
      // Convert Sets to Arrays for JSON serialization
      Object.keys(schema).forEach(key => {
        schema[key].types = Array.from(schema[key].types);
        schema[key].typeCount = typeCount[key];
      });
      
      res.json({
        collection: name,
        schema: schema,
        sampleSize: sampleDocs.length,
        totalDocuments: await collection.countDocuments()
      });
    } catch (error) {
      console.error('Schema error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get collection statistics
   */
  async getCollectionStats(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const { name } = req.params;
      const collection = db.collection(name);
      
      console.log(`Getting stats for collection: ${name}`);
      const stats = await db.command({ collStats: name });
      const count = await collection.countDocuments();
      
      res.json({
        collection: name,
        count: count,
        size: stats.size,
        storageSize: stats.storageSize,
        avgObjSize: stats.avgObjSize,
        indexCount: stats.nindexes,
        totalIndexSize: stats.totalIndexSize
      });
    } catch (error) {
      console.error(`Error getting stats for ${name}:`, error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get collection indexes
   */
  async getCollectionIndexes(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const { name } = req.params;
      const collection = db.collection(name);
      const indexes = await collection.indexes();
      
      res.json({
        collection: name,
        indexes: indexes
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Export collection data
   */
  async exportCollection(req, res) {
    try {
      const db = dbConnection.getDatabase();
      const { name } = req.params;
      const format = req.query.format || 'json';
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      
      const collection = db.collection(name);
      
      let query = collection.find({});
      if (limit) {
        query = query.limit(limit);
      }
      
      const documents = await query.toArray();
      
      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${name}.json"`);
        res.send(JSON.stringify(documents, null, 2));
      } else if (format === 'csv') {
        // Basic CSV export (simplified)
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${name}.csv"`);
        
        if (documents.length > 0) {
          const headers = Object.keys(documents[0]);
          let csv = headers.join(',') + '\n';
          
          documents.forEach(doc => {
            const row = headers.map(header => {
              const value = doc[header];
              if (typeof value === 'object') {
                return JSON.stringify(value);
              }
              return value;
            });
            csv += row.join(',') + '\n';
          });
          
          res.send(csv);
        } else {
          res.send('No data to export');
        }
      } else {
        res.status(400).json({ error: 'Unsupported format. Use json or csv' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

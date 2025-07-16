import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB client
let client;
let db;

async function connectToMongoDB() {
    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB Atlas successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

// API Routes

// ============= COLLECTION MANAGEMENT =============

// Get all collections
app.get('/api/collections', async (req, res) => {
    try {
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
});

// Create a new collection
app.post('/api/collections', async (req, res) => {
    try {
        const { name, options } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Collection name is required' });
        }
        
        await db.createCollection(name, options || {});
        res.json({ message: `Collection '${name}' created successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Drop a collection
app.delete('/api/collections/:name', async (req, res) => {
    try {
        const { name } = req.params;
        await db.collection(name).drop();
        res.json({ message: `Collection '${name}' dropped successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rename a collection
app.put('/api/collections/:name/rename', async (req, res) => {
    try {
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
});

// ============= DOCUMENT MANAGEMENT =============

// Get collection data with pagination
app.get('/api/collections/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || '_id';
        const order = req.query.order === 'desc' ? -1 : 1;
        
        const collection = db.collection(name);
        const totalDocuments = await collection.countDocuments();
        const sortObj = {};
        sortObj[sort] = order;
        
        const documents = await collection
            .find({})
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .toArray();
        
        res.json({
            collection: name,
            page: page,
            limit: limit,
            total: totalDocuments,
            totalPages: Math.ceil(totalDocuments / limit),
            documents: documents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new document
app.post('/api/collections/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const document = req.body;
        
        const collection = db.collection(name);
        const result = await collection.insertOne(document);
        
        res.status(201).json({
            message: 'Document created successfully',
            insertedId: result.insertedId,
            document: { ...document, _id: result.insertedId }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create multiple documents
app.post('/api/collections/:name/bulk', async (req, res) => {
    try {
        const { name } = req.params;
        const documents = req.body;
        
        if (!Array.isArray(documents)) {
            return res.status(400).json({ error: 'Documents must be an array' });
        }
        
        const collection = db.collection(name);
        const result = await collection.insertMany(documents);
        
        res.status(201).json({
            message: `${result.insertedCount} documents created successfully`,
            insertedIds: result.insertedIds,
            insertedCount: result.insertedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific document by ID
app.get('/api/collections/:name/:id', async (req, res) => {
    try {
        const { name, id } = req.params;
        const collection = db.collection(name);
        
        let document;
        try {
            // Try to find by ObjectId
            const { ObjectId } = await import('mongodb');
            document = await collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            // If not ObjectId, try as string
            document = await collection.findOne({ _id: id });
        }
        
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update specific document by ID
app.put('/api/collections/:name/:id', async (req, res) => {
    try {
        const { name, id } = req.params;
        const updateData = req.body;
        const collection = db.collection(name);
        
        let result;
        try {
            const { ObjectId } = await import('mongodb');
            result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );
        } catch (error) {
            result = await collection.updateOne(
                { _id: id },
                { $set: updateData }
            );
        }
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        res.json({
            message: 'Document updated successfully',
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete specific document by ID
app.delete('/api/collections/:name/:id', async (req, res) => {
    try {
        const { name, id } = req.params;
        const collection = db.collection(name);
        
        let result;
        try {
            const { ObjectId } = await import('mongodb');
            result = await collection.deleteOne({ _id: new ObjectId(id) });
        } catch (error) {
            result = await collection.deleteOne({ _id: id });
        }
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        res.json({
            message: 'Document deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= SEARCH AND QUERY =============

// Search in collection
app.get('/api/collections/:name/search', async (req, res) => {
    try {
        const { name } = req.params;
        const { query, field, type = 'text' } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const collection = db.collection(name);
        
        let searchQuery = {};
        if (query && field) {
            if (type === 'exact') {
                searchQuery[field] = query;
            } else if (type === 'number') {
                searchQuery[field] = parseFloat(query);
            } else if (type === 'regex') {
                searchQuery[field] = { $regex: query, $options: 'i' };
            } else {
                searchQuery[field] = { $regex: query, $options: 'i' };
            }
        } else if (query) {
            // Global text search
            searchQuery = { $text: { $search: query } };
        }
        
        const totalDocuments = await collection.countDocuments(searchQuery);
        const documents = await collection.find(searchQuery).skip(skip).limit(limit).toArray();
        
        res.json({
            collection: name,
            query: query,
            field: field,
            type: type,
            page: page,
            limit: limit,
            total: totalDocuments,
            totalPages: Math.ceil(totalDocuments / limit),
            documents: documents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Advanced query with filters
app.post('/api/collections/:name/query', async (req, res) => {
    try {
        const { name } = req.params;
        const { 
            filter = {}, 
            sort = { _id: 1 }, 
            projection = {},
            page = 1, 
            limit = 10 
        } = req.body;
        
        const skip = (page - 1) * limit;
        const collection = db.collection(name);
        
        const totalDocuments = await collection.countDocuments(filter);
        const documents = await collection
            .find(filter, { projection })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();
        
        res.json({
            collection: name,
            filter: filter,
            sort: sort,
            projection: projection,
            page: page,
            limit: limit,
            total: totalDocuments,
            totalPages: Math.ceil(totalDocuments / limit),
            documents: documents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= AGGREGATION AND ANALYTICS =============

// Get collection schema/structure
app.get('/api/collections/:name/schema', async (req, res) => {
    try {
        const { name } = req.params;
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
        res.status(500).json({ error: error.message });
    }
});

// Run aggregation pipeline
app.post('/api/collections/:name/aggregate', async (req, res) => {
    try {
        const { name } = req.params;
        const { pipeline } = req.body;
        
        if (!Array.isArray(pipeline)) {
            return res.status(400).json({ error: 'Pipeline must be an array' });
        }
        
        const collection = db.collection(name);
        const result = await collection.aggregate(pipeline).toArray();
        
        res.json({
            collection: name,
            pipeline: pipeline,
            result: result,
            count: result.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get collection statistics
app.get('/api/collections/:name/stats', async (req, res) => {
    try {
        const { name } = req.params;
        const collection = db.collection(name);
        
        const stats = await db.runCommand({ collStats: name });
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
        res.status(500).json({ error: error.message });
    }
});

// ============= INDEX MANAGEMENT =============

// Get collection indexes
app.get('/api/collections/:name/indexes', async (req, res) => {
    try {
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
});

// Create index
app.post('/api/collections/:name/indexes', async (req, res) => {
    try {
        const { name } = req.params;
        const { keys, options = {} } = req.body;
        
        if (!keys) {
            return res.status(400).json({ error: 'Index keys are required' });
        }
        
        const collection = db.collection(name);
        const result = await collection.createIndex(keys, options);
        
        res.json({
            message: 'Index created successfully',
            indexName: result,
            keys: keys,
            options: options
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Drop index
app.delete('/api/collections/:name/indexes/:indexName', async (req, res) => {
    try {
        const { name, indexName } = req.params;
        const collection = db.collection(name);
        
        await collection.dropIndex(indexName);
        
        res.json({
            message: `Index '${indexName}' dropped successfully`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= BULK OPERATIONS =============

// Bulk update documents
app.put('/api/collections/:name/bulk', async (req, res) => {
    try {
        const { name } = req.params;
        const { filter, update } = req.body;
        
        if (!filter || !update) {
            return res.status(400).json({ error: 'Filter and update are required' });
        }
        
        const collection = db.collection(name);
        const result = await collection.updateMany(filter, { $set: update });
        
        res.json({
            message: 'Bulk update completed',
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk delete documents
app.delete('/api/collections/:name/bulk', async (req, res) => {
    try {
        const { name } = req.params;
        const { filter } = req.body;
        
        if (!filter) {
            return res.status(400).json({ error: 'Filter is required' });
        }
        
        const collection = db.collection(name);
        const result = await collection.deleteMany(filter);
        
        res.json({
            message: 'Bulk delete completed',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= IMPORT/EXPORT =============

// Export collection data
app.get('/api/collections/:name/export', async (req, res) => {
    try {
        const { name } = req.params;
        const format = req.query.format || 'json';
        const collection = db.collection(name);
        
        const documents = await collection.find({}).toArray();
        
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
});

// Import data to collection
app.post('/api/collections/:name/import', async (req, res) => {
    try {
        const { name } = req.params;
        const { data, mode = 'insert' } = req.body;
        
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: 'Data must be an array' });
        }
        
        const collection = db.collection(name);
        let result;
        
        if (mode === 'insert') {
            result = await collection.insertMany(data);
            res.json({
                message: 'Data imported successfully',
                insertedCount: result.insertedCount
            });
        } else if (mode === 'upsert') {
            // Upsert mode - update existing or insert new
            const bulkOps = data.map(doc => ({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: doc },
                    upsert: true
                }
            }));
            
            result = await collection.bulkWrite(bulkOps);
            res.json({
                message: 'Data imported with upsert',
                upsertedCount: result.upsertedCount,
                modifiedCount: result.modifiedCount
            });
        } else {
            res.status(400).json({ error: 'Invalid mode. Use insert or upsert' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
async function startServer() {
    await connectToMongoDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Database: ${dbName}`);
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    if (client) {
        await client.close();
    }
    process.exit(0);
});

// For Vercel deployment, we need to export the app
export default app;

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    startServer().catch(console.error);
}

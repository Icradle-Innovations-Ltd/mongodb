import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();

// MongoDB connection
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB client
let client;
let db;

async function connectToMongoDB() {
    try {
        if (!client) {
            client = new MongoClient(uri);
            await client.connect();
            db = client.db(dbName);
            console.log('Connected to MongoDB Atlas');
        }
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

// Get all collections
app.get('/api/collections', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collections = await database.listCollections().toArray();
        const collectionsWithCounts = await Promise.all(
            collections.map(async (col) => {
                const count = await database.collection(col.name).countDocuments();
                return {
                    name: col.name,
                    count: count
                };
            })
        );
        res.json(collectionsWithCounts);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
});

// Get database stats
app.get('/api/stats', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collections = await database.listCollections().toArray();
        
        const stats = {
            database: dbName,
            collections: collections.length,
            totalDocuments: 0,
            collectionsDetails: []
        };
        
        for (const col of collections) {
            const count = await database.collection(col.name).countDocuments();
            stats.totalDocuments += count;
            stats.collectionsDetails.push({
                name: col.name,
                count: count
            });
        }
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch database stats' });
    }
});

// Get documents from a collection
app.get('/api/collections/:name', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const collection = database.collection(collectionName);
        const total = await collection.countDocuments();
        const documents = await collection.find({}).skip(skip).limit(limit).toArray();
        
        res.json({
            documents,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// Search in a collection
app.get('/api/collections/:name/search', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        const query = req.query.query || '';
        const field = req.query.field || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const collection = database.collection(collectionName);
        let searchQuery = {};
        
        if (query) {
            if (field) {
                searchQuery[field] = { $regex: query, $options: 'i' };
            } else {
                // Try to search across multiple potential text fields
                const sampleDoc = await collection.findOne({});
                if (sampleDoc) {
                    const textFields = Object.keys(sampleDoc).filter(key => 
                        typeof sampleDoc[key] === 'string' || 
                        (Array.isArray(sampleDoc[key]) && sampleDoc[key].some(item => typeof item === 'string'))
                    );
                    
                    if (textFields.length > 0) {
                        searchQuery = {
                            $or: textFields.map(field => ({
                                [field]: { $regex: query, $options: 'i' }
                            }))
                        };
                    }
                }
            }
        }
        
        const total = await collection.countDocuments(searchQuery);
        const documents = await collection.find(searchQuery).skip(skip).limit(limit).toArray();
        
        res.json({
            documents,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error searching documents:', error);
        res.status(500).json({ error: 'Failed to search documents' });
    }
});

// Create a new document
app.post('/api/collections/:name', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        const document = req.body;
        
        const collection = database.collection(collectionName);
        const result = await collection.insertOne(document);
        
        res.status(201).json({
            message: 'Document created successfully',
            insertedId: result.insertedId
        });
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
});

// Update a document
app.put('/api/collections/:name/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        const documentId = req.params.id;
        const updateData = req.body;
        
        const collection = database.collection(collectionName);
        const result = await collection.updateOne(
            { _id: new ObjectId(documentId) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        res.json({
            message: 'Document updated successfully',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Failed to update document' });
    }
});

// Delete a document
app.delete('/api/collections/:name/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        const documentId = req.params.id;
        
        const collection = database.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(documentId) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        res.json({
            message: 'Document deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

// Get a single document by ID
app.get('/api/collections/:name/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        const documentId = req.params.id;
        
        const collection = database.collection(collectionName);
        const document = await collection.findOne({ _id: new ObjectId(documentId) });
        
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        res.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
});

// Export collection data
app.get('/api/collections/:name/export', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        const format = req.query.format || 'json';
        
        const collection = database.collection(collectionName);
        const documents = await collection.find({}).toArray();
        
        if (format === 'csv') {
            // Convert to CSV
            if (documents.length === 0) {
                return res.status(404).json({ error: 'No documents found' });
            }
            
            const headers = Object.keys(documents[0]);
            const csvData = [
                headers.join(','),
                ...documents.map(doc => 
                    headers.map(header => JSON.stringify(doc[header] || '')).join(',')
                )
            ].join('\n');
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${collectionName}.csv"`);
            res.send(csvData);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${collectionName}.json"`);
            res.json(documents);
        }
    } catch (error) {
        console.error('Error exporting collection:', error);
        res.status(500).json({ error: 'Failed to export collection' });
    }
});

// Aggregate data
app.post('/api/collections/:name/aggregate', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        const pipeline = req.body.pipeline || [];
        
        const collection = database.collection(collectionName);
        const result = await collection.aggregate(pipeline).toArray();
        
        res.json(result);
    } catch (error) {
        console.error('Error running aggregation:', error);
        res.status(500).json({ error: 'Failed to run aggregation' });
    }
});

// Get collection schema
app.get('/api/collections/:name/schema', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const collectionName = req.params.name;
        
        const collection = database.collection(collectionName);
        const sampleDocs = await collection.find({}).limit(100).toArray();
        
        const schema = {};
        sampleDocs.forEach(doc => {
            Object.keys(doc).forEach(key => {
                const type = typeof doc[key];
                if (!schema[key]) {
                    schema[key] = { types: new Set(), examples: [] };
                }
                schema[key].types.add(type);
                if (schema[key].examples.length < 3) {
                    schema[key].examples.push(doc[key]);
                }
            });
        });
        
        // Convert Sets to Arrays for JSON serialization
        Object.keys(schema).forEach(key => {
            schema[key].types = Array.from(schema[key].types);
        });
        
        res.json(schema);
    } catch (error) {
        console.error('Error fetching schema:', error);
        res.status(500).json({ error: 'Failed to fetch schema' });
    }
});

// Catch-all for other API routes
app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// For non-API routes, return a simple message
app.get('/', (req, res) => {
    res.json({ message: 'MongoDB API is running. Go to /public/index.html for the web interface.' });
});

export default app;

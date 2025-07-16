import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

let client;

async function connectToMongoDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    return client.db(dbName);
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
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
        res.status(500).json({ error: 'Failed to fetch database stats', details: error.message });
    }
}

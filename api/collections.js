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
        res.status(500).json({ error: 'Failed to fetch collections', details: error.message });
    }
}

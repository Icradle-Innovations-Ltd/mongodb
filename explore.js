import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

async function exploreMongoDBCluster() {
    const client = new MongoClient(uri);
    
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas!');
        
        // List all databases
        console.log('\n=== Available Databases ===');
        const adminDb = client.db().admin();
        const databases = await adminDb.listDatabases();
        
        databases.databases.forEach((db, index) => {
            console.log(`${index + 1}. ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });
        
        console.log(`\n=== Exploring Database: ${dbName} ===`);
        
        // Access the specified database
        const db = client.db(dbName);
        
        // Get all collections in the database
        const collections = await db.listCollections().toArray();
        console.log(`\nFound ${collections.length} collections in database "${dbName}":`);
        
        if (collections.length > 0) {
            // Iterate through each collection and retrieve data
            for (const collectionInfo of collections) {
                const collectionName = collectionInfo.name;
                console.log(`\n=== Collection: ${collectionName} ===`);
                
                const collection = db.collection(collectionName);
                
                // Get document count
                const count = await collection.countDocuments();
                console.log(`Total documents: ${count}`);
                
                // Get sample document to understand structure
                const sampleDoc = await collection.findOne({});
                if (sampleDoc) {
                    console.log('\nSample document structure:');
                    console.log(JSON.stringify(sampleDoc, null, 2));
                }
                
                // Retrieve first 5 documents
                const documents = await collection.find({}).limit(5).toArray();
                
                if (documents.length > 0) {
                    console.log(`\nFirst ${Math.min(5, documents.length)} documents:`);
                    documents.forEach((doc, index) => {
                        console.log(`\n--- Document ${index + 1} ---`);
                        console.log(JSON.stringify(doc, null, 2));
                    });
                    
                    if (count > 5) {
                        console.log(`\n... and ${count - 5} more documents`);
                    }
                } else {
                    console.log('No documents found in this collection.');
                }
                
                console.log('\n' + '='.repeat(60));
            }
        } else {
            console.log('No collections found in the specified database.');
            console.log('\nTrying to explore other databases...');
            
            // Check other databases for data
            for (const dbInfo of databases.databases) {
                if (dbInfo.name !== 'admin' && dbInfo.name !== 'local' && dbInfo.name !== 'config') {
                    console.log(`\n=== Checking Database: ${dbInfo.name} ===`);
                    const otherDb = client.db(dbInfo.name);
                    const otherCollections = await otherDb.listCollections().toArray();
                    
                    if (otherCollections.length > 0) {
                        console.log(`Found ${otherCollections.length} collections:`);
                        otherCollections.forEach(col => {
                            console.log(`- ${col.name}`);
                        });
                        
                        // Show sample from first collection
                        const firstCollection = otherDb.collection(otherCollections[0].name);
                        const sampleCount = await firstCollection.countDocuments();
                        console.log(`\nSample from ${otherCollections[0].name} (${sampleCount} documents):`);
                        
                        const samples = await firstCollection.find({}).limit(2).toArray();
                        samples.forEach((doc, index) => {
                            console.log(`\nSample ${index + 1}:`);
                            console.log(JSON.stringify(doc, null, 2));
                        });
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        // Close the connection
        await client.close();
        console.log('\nConnection closed.');
    }
}

// Run the function
exploreMongoDBCluster().catch(console.error);

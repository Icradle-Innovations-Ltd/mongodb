import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

async function connectAndRetrieveData() {
    const client = new MongoClient(uri);
    
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas!');
        
        // First, list all databases
        console.log('\n=== Available Databases ===');
        const adminDb = client.db().admin();
        const databases = await adminDb.listDatabases();
        
        databases.databases.forEach((db, index) => {
            console.log(`${index + 1}. ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });
        
        // Access the specified database
        const db = client.db(dbName);
        
        // Get all collections in the database
        const collections = await db.listCollections().toArray();
        console.log(`\nFound ${collections.length} collections in database "${dbName}":`);
        
        // If no collections in specified database, check other databases
        if (collections.length === 0) {
            console.log('No collections found in the specified database.');
            console.log('\nExploring other databases for data...');
            
            for (const dbInfo of databases.databases) {
                if (dbInfo.name !== 'admin' && dbInfo.name !== 'local' && dbInfo.name !== 'config') {
                    console.log(`\n=== Checking Database: ${dbInfo.name} ===`);
                    const otherDb = client.db(dbInfo.name);
                    const otherCollections = await otherDb.listCollections().toArray();
                    
                    if (otherCollections.length > 0) {
                        console.log(`Found ${otherCollections.length} collections:`);
                        
                        // Show data from each collection
                        for (const collectionInfo of otherCollections) {
                            const collectionName = collectionInfo.name;
                            console.log(`\n--- Collection: ${collectionName} ---`);
                            
                            const collection = otherDb.collection(collectionName);
                            const count = await collection.countDocuments();
                            console.log(`Total documents: ${count}`);
                            
                            // Retrieve sample documents
                            const documents = await collection.find({}).limit(3).toArray();
                            
                            if (documents.length > 0) {
                                console.log('\nSample documents:');
                                documents.forEach((doc, index) => {
                                    console.log(`\nDocument ${index + 1}:`);
                                    console.log(JSON.stringify(doc, null, 2));
                                });
                                
                                if (count > 3) {
                                    console.log(`\n... and ${count - 3} more documents`);
                                }
                            }
                        }
                    }
                }
            }
            return;
        }
        
        // Iterate through each collection and retrieve data
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`\n=== Collection: ${collectionName} ===`);
            
            const collection = db.collection(collectionName);
            
            // Get document count
            const count = await collection.countDocuments();
            console.log(`Total documents: ${count}`);
            
            // Retrieve all documents (limit to 10 for display purposes)
            const documents = await collection.find({}).limit(10).toArray();
            
            if (documents.length > 0) {
                console.log('\nSample documents:');
                documents.forEach((doc, index) => {
                    console.log(`\nDocument ${index + 1}:`);
                    console.log(JSON.stringify(doc, null, 2));
                });
                
                if (count > 10) {
                    console.log(`\n... and ${count - 10} more documents`);
                }
            } else {
                console.log('No documents found in this collection.');
            }
            
            console.log('\n' + '='.repeat(50));
        }
        
        if (collections.length === 0) {
            console.log('No collections found in the database.');
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
connectAndRetrieveData().catch(console.error);

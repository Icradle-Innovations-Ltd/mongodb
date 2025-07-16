import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

async function retrieveAllData() {
    const client = new MongoClient(uri);
    let allData = {};
    
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas!');
        
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        
        console.log(`\nRetrieving data from ${collections.length} collections...\n`);
        
        // Process each collection
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`Processing collection: ${collectionName}...`);
            
            const collection = db.collection(collectionName);
            const count = await collection.countDocuments();
            
            // For small collections, get all documents
            // For large collections, get a reasonable sample
            let documents;
            if (count <= 100) {
                documents = await collection.find({}).toArray();
            } else {
                documents = await collection.find({}).limit(50).toArray();
            }
            
            allData[collectionName] = {
                totalDocuments: count,
                sampleDocuments: documents,
                sampleSize: documents.length
            };
            
            console.log(`  - ${count} total documents`);
            console.log(`  - Retrieved ${documents.length} sample documents`);
        }
        
        // Save all data to JSON file
        const outputFile = 'mongodb_data.json';
        fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
        console.log(`\nAll data has been saved to ${outputFile}`);
        
        // Display summary
        console.log('\n=== DATA SUMMARY ===');
        Object.entries(allData).forEach(([collectionName, data]) => {
            console.log(`${collectionName}: ${data.totalDocuments} documents`);
        });
        
        // Show some interesting statistics
        console.log('\n=== INTERESTING STATISTICS ===');
        
        if (allData.movies) {
            const movies = allData.movies.sampleDocuments;
            const genres = new Set();
            movies.forEach(movie => {
                if (movie.genres) {
                    movie.genres.forEach(genre => genres.add(genre));
                }
            });
            console.log(`Movie genres found: ${Array.from(genres).join(', ')}`);
        }
        
        if (allData.users) {
            console.log(`Total users: ${allData.users.totalDocuments}`);
        }
        
        if (allData.theaters) {
            const theaters = allData.theaters.sampleDocuments;
            const states = new Set();
            theaters.forEach(theater => {
                if (theater.location?.address?.state) {
                    states.add(theater.location.address.state);
                }
            });
            console.log(`Theater states: ${Array.from(states).join(', ')}`);
        }
        
        if (allData.comments) {
            console.log(`Total comments: ${allData.comments.totalDocuments}`);
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('\nConnection closed.');
    }
}

// Run the function
retrieveAllData().catch(console.error);

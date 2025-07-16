// Test file to demonstrate MongoDB API usage
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        console.log(`${options.method || 'GET'} ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error.message);
    }
}

async function runTests() {
    console.log('🧪 Testing MongoDB API Endpoints\n');
    
    // 1. Get database stats
    console.log('1. Getting database statistics...');
    await apiCall('/api/stats');
    
    // 2. Get all collections
    console.log('\n2. Getting all collections...');
    await apiCall('/api/collections');
    
    // 3. Get movies collection with pagination
    console.log('\n3. Getting movies collection (first 5)...');
    await apiCall('/api/collections/movies?page=1&limit=5');
    
    // 4. Search for action movies
    console.log('\n4. Searching for action movies...');
    await apiCall('/api/collections/movies/search?field=genres&query=Action&type=text');
    
    // 5. Get collection schema
    console.log('\n5. Getting movies collection schema...');
    await apiCall('/api/collections/movies/schema');
    
    // 6. Run aggregation to count movies by year
    console.log('\n6. Running aggregation - movies by year...');
    await apiCall('/api/collections/movies/aggregate', {
        method: 'POST',
        body: JSON.stringify({
            pipeline: [
                { $group: { _id: '$year', count: { $sum: 1 } } },
                { $sort: { _id: -1 } },
                { $limit: 10 }
            ]
        })
    });
    
    // 7. Advanced query - find theaters in California
    console.log('\n7. Finding theaters in California...');
    await apiCall('/api/collections/theaters/query', {
        method: 'POST',
        body: JSON.stringify({
            filter: {
                'location.address.state': 'CA'
            },
            limit: 5
        })
    });
    
    // 8. Get collection statistics
    console.log('\n8. Getting movies collection statistics...');
    await apiCall('/api/collections/movies/stats');
    
    // 9. Get collection indexes
    console.log('\n9. Getting movies collection indexes...');
    await apiCall('/api/collections/movies/indexes');
    
    // 10. Create a test collection (commented out to avoid modifying database)
    /*
    console.log('\n10. Creating test collection...');
    await apiCall('/api/collections', {
        method: 'POST',
        body: JSON.stringify({
            name: 'test_collection'
        })
    });
    */
    
    console.log('\n✅ API tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export { apiCall, runTests };

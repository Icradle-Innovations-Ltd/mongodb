#!/usr/bin/env node

// Simple API test script
const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🔍 Testing MongoDB API Server\n');
  
  const tests = [
    { url: '/api/stats', name: 'Database Stats' },
    { url: '/api/collections', name: 'Collections List' },
    { url: '/api/collections/movies?page=1&limit=5', name: 'Movies Collection' },
    { url: '/api/collections/movies/search?query=Action&field=genres', name: 'Search Movies' },
    { url: '/api/collections/movies/schema', name: 'Movies Schema' },
    { url: '/api/collections/movies/stats', name: 'Movies Stats' }
  ];
  
  for (const test of tests) {
    try {
      const response = await fetch(`${BASE_URL}${test.url}`);
      const status = response.status;
      
      if (status === 200) {
        console.log(`✅ ${test.name} - PASS`);
      } else {
        console.log(`❌ ${test.name} - FAIL (${status})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
    }
  }
  
  console.log('\n🎉 API test complete!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or you can install node-fetch');
  process.exit(1);
}

testAPI();

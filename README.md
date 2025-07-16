# MongoDB Data Explorer & API

A comprehensive web application and REST API for managing MongoDB databases with full CRUD operations, search capabilities, and data analytics.

## Features

### 🌐 Web Interface
- **Dashboard**: Real-time database statistics and collection overview
- **Collection Browser**: Interactive collection cards with document counts
- **Data Viewer**: Paginated document browsing with search functionality
- **Document Details**: JSON viewer for individual documents
- **Responsive Design**: Works on desktop and mobile devices

### 🚀 REST API
- **Collection Management**: Create, read, update, delete collections
- **Document Operations**: Full CRUD operations on documents
- **Search & Query**: Advanced search with filters and aggregation
- **Index Management**: Create and manage database indexes
- **Bulk Operations**: Batch updates and deletions
- **Data Import/Export**: JSON and CSV format support
- **Analytics**: Collection statistics and schema analysis

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   - Update `.env` with your MongoDB connection string
   ```
   MONGODB_URI=your_mongodb_connection_string
   DATABASE_NAME=your_database_name
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Web UI: http://localhost:3000
   - API Base URL: http://localhost:3000/api

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run data` - Run data retrieval script
- `npm test` - Run API tests

## API Endpoints

### Collections
- `GET /api/collections` - List all collections
- `POST /api/collections` - Create new collection
- `DELETE /api/collections/:name` - Delete collection
- `PUT /api/collections/:name/rename` - Rename collection

### Documents
- `GET /api/collections/:name` - Get documents with pagination
- `POST /api/collections/:name` - Create new document
- `POST /api/collections/:name/bulk` - Create multiple documents
- `GET /api/collections/:name/:id` - Get document by ID
- `PUT /api/collections/:name/:id` - Update document
- `DELETE /api/collections/:name/:id` - Delete document

### Search & Query
- `GET /api/collections/:name/search` - Simple search
- `POST /api/collections/:name/query` - Advanced query with filters
- `POST /api/collections/:name/aggregate` - Run aggregation pipeline

### Analytics
- `GET /api/collections/:name/schema` - Get collection schema
- `GET /api/collections/:name/stats` - Get collection statistics
- `GET /api/stats` - Get database statistics

### Index Management
- `GET /api/collections/:name/indexes` - List indexes
- `POST /api/collections/:name/indexes` - Create index
- `DELETE /api/collections/:name/indexes/:indexName` - Drop index

### Bulk Operations
- `PUT /api/collections/:name/bulk` - Bulk update
- `DELETE /api/collections/:name/bulk` - Bulk delete

### Import/Export
- `GET /api/collections/:name/export` - Export collection data
- `POST /api/collections/:name/import` - Import data

## Example Usage

### Web Interface
1. Navigate to http://localhost:3000
2. View database overview and collection statistics
3. Click on any collection to browse documents
4. Use the search form to find specific documents
5. Click "View" on any document to see full details

### API Examples

**Get all collections:**
```bash
curl http://localhost:3000/api/collections
```

**Search for movies:**
```bash
curl "http://localhost:3000/api/collections/movies/search?field=genres&query=Action"
```

**Create a new document:**
```bash
curl -X POST http://localhost:3000/api/collections/movies \
  -H "Content-Type: application/json" \
  -d '{"title": "New Movie", "year": 2024}'
```

**Run aggregation:**
```bash
curl -X POST http://localhost:3000/api/collections/movies/aggregate \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline": [
      {"$group": {"_id": "$year", "count": {"$sum": 1}}},
      {"$sort": {"_id": -1}}
    ]
  }'
```

## Database Schema

This application works with the MongoDB sample_mflix database which contains:

- **movies** (21,349 documents) - Movie information with cast, genres, ratings
- **users** (185 documents) - User accounts
- **theaters** (1,564 documents) - Theater locations
- **comments** (41,079 documents) - User comments on movies
- **embedded_movies** (3,483 documents) - Movies with embedded plot vectors
- **sessions** (1 document) - User session data

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: None (add your own for production)

## Security Considerations

⚠️ **Important**: This application currently has no authentication or authorization. Before deploying to production:

1. Add authentication middleware
2. Implement role-based access control
3. Add input validation and sanitization
4. Use HTTPS
5. Implement rate limiting
6. Add request logging

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
1. Check the API documentation in `API_DOCUMENTATION.md`
2. Run the test suite with `npm test`
3. Check the server logs for debugging information

---

**Happy coding! 🚀**

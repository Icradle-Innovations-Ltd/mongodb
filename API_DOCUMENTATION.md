# MongoDB API Documentation

## Base URL
```
http://localhost:3000
```

## Collection Management

### Get All Collections
**Endpoint:** `GET /api/collections`

Returns all collections with document counts.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/collections" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections`
- Headers: `Content-Type: application/json`

### Create Collection
**Endpoint:** `POST /api/collections`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "collection_name",
    "options": {
      "capped": false,
      "size": 100000
    }
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "name": "collection_name",
    "options": {
        "capped": false,
        "size": 100000
    }
}
```

### Delete Collection
**Endpoint:** `DELETE /api/collections/{name}`

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/collections/test_collection" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `DELETE`
- URL: `http://localhost:3000/api/collections/test_collection`
- Headers: `Content-Type: application/json`

### Rename Collection
**Endpoint:** `PUT /api/collections/{name}/rename`

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/collections/old_name/rename" \
  -H "Content-Type: application/json" \
  -d '{
    "newName": "new_collection_name"
  }'
```

**Postman:**
- Method: `PUT`
- URL: `http://localhost:3000/api/collections/old_name/rename`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "newName": "new_collection_name"
}
```

## Document Management

### Get Collection Documents
**Endpoint:** `GET /api/collections/{name}`

Parameters:
- `page`: Page number (default: 1)
- `limit`: Documents per page (default: 10)
- `sort`: Sort field (default: _id)
- `order`: Sort order - asc/desc (default: asc)

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/collections/movies?page=1&limit=10&sort=_id&order=asc" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections/movies`
- Params: 
  - `page`: `1`
  - `limit`: `10`
  - `sort`: `_id`
  - `order`: `asc`

### Create Document
**Endpoint:** `POST /api/collections/{name}`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/movies" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Movie",
    "year": 2024,
    "genres": ["Action", "Drama"]
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/movies`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "title": "New Movie",
    "year": 2024,
    "genres": ["Action", "Drama"]
}
```

### Create Multiple Documents
**Endpoint:** `POST /api/collections/{name}/bulk`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/movies/bulk" \
  -H "Content-Type: application/json" \
  -d '[
    {"title": "Movie 1", "year": 2024},
    {"title": "Movie 2", "year": 2024}
  ]'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/movies/bulk`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
[
    {"title": "Movie 1", "year": 2024},
    {"title": "Movie 2", "year": 2024}
]
```

### Get Document by ID
**Endpoint:** `GET /api/collections/{name}/{id}`

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/collections/movies/573a1390f29313caabcd42e8" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections/movies/573a1390f29313caabcd42e8`
- Headers: `Content-Type: application/json`

### Update Document
**Endpoint:** `PUT /api/collections/{name}/{id}`

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/collections/movies/573a1390f29313caabcd42e8" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Movie Title",
    "year": 2025
  }'
```

**Postman:**
- Method: `PUT`
- URL: `http://localhost:3000/api/collections/movies/573a1390f29313caabcd42e8`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "title": "Updated Movie Title",
    "year": 2025
}
```

### Delete Document
**Endpoint:** `DELETE /api/collections/{name}/{id}`

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/collections/movies/573a1390f29313caabcd42e8" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `DELETE`
- URL: `http://localhost:3000/api/collections/movies/573a1390f29313caabcd42e8`
- Headers: `Content-Type: application/json`

## Search and Query

### Simple Search
**Endpoint:** `GET /api/collections/{name}/search`

Parameters:
- `query`: Search term
- `field`: Field to search in (optional)
- `type`: Search type - text/exact/number/regex (default: text)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/collections/movies/search?query=Action&field=genres&type=text&page=1&limit=5" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections/movies/search`
- Params:
  - `query`: `Action`
  - `field`: `genres`
  - `type`: `text`
  - `page`: `1`
  - `limit`: `5`

### Advanced Query
**Endpoint:** `POST /api/collections/{name}/query`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/movies/query" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "year": {"$gte": 2000, "$lte": 2010},
      "genres": {"$in": ["Action", "Drama"]}
    },
    "sort": {"year": -1},
    "projection": {"title": 1, "year": 1, "genres": 1},
    "page": 1,
    "limit": 10
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/movies/query`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "filter": {
        "year": {"$gte": 2000, "$lte": 2010},
        "genres": {"$in": ["Action", "Drama"]}
    },
    "sort": {"year": -1},
    "projection": {"title": 1, "year": 1, "genres": 1},
    "page": 1,
    "limit": 10
}
```

## Analytics and Aggregation

### Get Collection Schema
**Endpoint:** `GET /api/collections/{name}/schema`

Returns field types and structure analysis.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/collections/movies/schema" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections/movies/schema`
- Headers: `Content-Type: application/json`

### Run Aggregation Pipeline
**Endpoint:** `POST /api/collections/{name}/aggregate`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/movies/aggregate" \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline": [
      {"$match": {"year": {"$gte": 2000}}},
      {"$group": {"_id": "$year", "count": {"$sum": 1}}},
      {"$sort": {"_id": -1}},
      {"$limit": 10}
    ]
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/movies/aggregate`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "pipeline": [
        {"$match": {"year": {"$gte": 2000}}},
        {"$group": {"_id": "$year", "count": {"$sum": 1}}},
        {"$sort": {"_id": -1}},
        {"$limit": 10}
    ]
}
```

### Get Collection Statistics
**Endpoint:** `GET /api/collections/{name}/stats`

Returns collection size, document count, and storage stats.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/collections/movies/stats" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections/movies/stats`
- Headers: `Content-Type: application/json`

## Index Management

### Get Collection Indexes
**Endpoint:** `GET /api/collections/{name}/indexes`

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/collections/movies/indexes" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections/movies/indexes`
- Headers: `Content-Type: application/json`

### Create Index
**Endpoint:** `POST /api/collections/{name}/indexes`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/movies/indexes" \
  -H "Content-Type: application/json" \
  -d '{
    "keys": {"title": 1, "year": -1},
    "options": {
      "name": "title_year_index",
      "unique": false,
      "background": true
    }
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/movies/indexes`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "keys": {"title": 1, "year": -1},
    "options": {
        "name": "title_year_index",
        "unique": false,
        "background": true
    }
}
```

### Drop Index
**Endpoint:** `DELETE /api/collections/{name}/indexes/{indexName}`

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/collections/movies/indexes/title_year_index" \
  -H "Content-Type: application/json"
```

**Postman:**
- Method: `DELETE`
- URL: `http://localhost:3000/api/collections/movies/indexes/title_year_index`
- Headers: `Content-Type: application/json`

## Bulk Operations

### Bulk Update
**Endpoint:** `PUT /api/collections/{name}/bulk`

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/collections/movies/bulk" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {"year": {"$lt": 1950}},
    "update": {"category": "classic"}
  }'
```

**Postman:**
- Method: `PUT`
- URL: `http://localhost:3000/api/collections/movies/bulk`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "filter": {"year": {"$lt": 1950}},
    "update": {"category": "classic"}
}
```

### Bulk Delete
**Endpoint:** `DELETE /api/collections/{name}/bulk`

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/collections/movies/bulk" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {"year": {"$lt": 1900}}
  }'
```

**Postman:**
- Method: `DELETE`
- URL: `http://localhost:3000/api/collections/movies/bulk`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "filter": {"year": {"$lt": 1900}}
}
```

## Data Import/Export

### Export Collection
**Endpoint:** `GET /api/collections/{name}/export`

**Parameters:**
- `format`: Export format - json/csv (default: json)

**cURL Example (JSON):**
```bash
curl -X GET "http://localhost:3000/api/collections/movies/export?format=json" \
  -H "Accept: application/json" \
  -o movies_export.json
```

**cURL Example (CSV):**
```bash
curl -X GET "http://localhost:3000/api/collections/movies/export?format=csv" \
  -H "Accept: text/csv" \
  -o movies_export.csv
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections/movies/export?format=json`
- Headers: `Accept: application/json`
- Save Response: Enable "Send and Download" to save file

### Import Data
**Endpoint:** `POST /api/collections/{name}/import`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/movies/import" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"title": "New Movie", "year": 2024, "genre": "Action"},
      {"title": "Another Movie", "year": 2024, "genre": "Drama"}
    ],
    "mode": "insert"
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/movies/import`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "data": [
        {"title": "New Movie", "year": 2024, "genre": "Action"},
        {"title": "Another Movie", "year": 2024, "genre": "Drama"}
    ],
    "mode": "insert"
}
```

**Parameters:**
- `mode`: Import mode - insert/upsert (default: insert)

## Database Operations

### Get Database Stats
**Endpoint:** `GET /api/stats`

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/stats" \
  -H "Accept: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/stats`
- Headers: `Accept: application/json`

**Description:** Returns database overview with collection counts and document statistics.

## Response Format

### Success Response
```json
{
    "message": "Operation completed successfully",
    "data": {...},
    "count": 123
}
```

### Error Response
```json
{
    "error": "Error message description"
}
```

## Common Query Examples

### Find Movies by Genre
**Endpoint:** `GET /api/collections/movies/search`

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/collections/movies/search?field=genres&query=Action&type=text" \
  -H "Accept: application/json"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/collections/movies/search?field=genres&query=Action&type=text`
- Headers: `Accept: application/json`

### Find Users by Email Domain
**Endpoint:** `POST /api/collections/users/query`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/users/query" \
  -H "Content-Type: application/json" \
  -d '{
    "email": {"$regex": "@gmail.com$", "$options": "i"}
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/users/query`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "email": {"$regex": "@gmail.com$", "$options": "i"}
}
```

### Get Top Rated Movies
**Endpoint:** `POST /api/collections/movies/aggregate`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/movies/aggregate" \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline": [
      {"$match": {"imdb.rating": {"$gte": 8.0}}},
      {"$sort": {"imdb.rating": -1}},
      {"$limit": 10}
    ]
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/movies/aggregate`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "pipeline": [
        {"$match": {"imdb.rating": {"$gte": 8.0}}},
        {"$sort": {"imdb.rating": -1}},
        {"$limit": 10}
    ]
}
```

### Count Movies by Year
**Endpoint:** `POST /api/collections/movies/aggregate`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/movies/aggregate" \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline": [
      {"$group": {"_id": "$year", "count": {"$sum": 1}}},
      {"$sort": {"count": -1}},
      {"$limit": 10}
    ]
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/movies/aggregate`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "pipeline": [
        {"$group": {"_id": "$year", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
}
```

### Find Theaters in Specific State
**Endpoint:** `POST /api/collections/theaters/query`

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/collections/theaters/query" \
  -H "Content-Type: application/json" \
  -d '{
    "location.address.state": "CA"
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/collections/theaters/query`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
    "location.address.state": "CA"
}
```

## Authentication
Currently, the API does not require authentication. In production, implement proper authentication and authorization.

## Error Handling
The API includes comprehensive error handling with appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (collection/document not found)
- `500`: Internal Server Error

## Rate Limiting
Consider implementing rate limiting in production to prevent abuse and ensure fair usage of the API endpoints.

## Rate Limiting
No rate limiting is currently implemented. Consider adding rate limiting for production use.

## Error Handling
All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

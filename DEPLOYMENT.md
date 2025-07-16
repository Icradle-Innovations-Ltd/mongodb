# MongoDB Database Explorer - Vercel Deployment Guide

## Deployment Steps

### 1. Environment Variables
Make sure you have set the following environment variables in your Vercel dashboard:
- `MONGODB_URI`: Your MongoDB connection string
- `DATABASE_NAME`: Your database name (e.g., sample_mflix)

### 2. Project Structure
```
mongodb/
├── api/
│   └── index.js          # Serverless API handler
├── public/
│   └── index.html        # Web interface
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
├── .env                  # Environment variables (local only)
├── .gitignore           # Git ignore file
└── index.html           # Root fallback page
```

### 3. Vercel Configuration (vercel.json)
- API routes are handled by `api/index.js`
- Static files are served from `public/` directory
- Serverless functions have 30-second timeout

### 4. API Endpoints
- `GET /api/stats` - Database statistics
- `GET /api/collections` - List all collections
- `GET /api/collections/:name` - Get collection documents
- `GET /api/collections/:name/search` - Search collection
- `POST /api/collections/:name` - Create document
- `PUT /api/collections/:name/:id` - Update document
- `DELETE /api/collections/:name/:id` - Delete document
- `GET /api/collections/:name/export` - Export collection data

### 5. Deployment Commands

#### Deploy to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (from project root)
vercel

# Or deploy directly
vercel --prod
```

#### Environment Variables (Set in Vercel Dashboard):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=sample_mflix
NODE_ENV=production
```

### 6. Post-Deployment
1. Access your app at the Vercel URL
2. Test API endpoints: `https://your-app.vercel.app/api/stats`
3. Use the web interface: `https://your-app.vercel.app/public/index.html`

### 7. Troubleshooting
- Check Vercel function logs for API errors
- Verify environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check that database name matches your MongoDB Atlas database

## Features
- ✅ Serverless API with MongoDB Atlas
- ✅ Responsive web interface
- ✅ Collection browsing and search
- ✅ Document CRUD operations
- ✅ Data export (JSON/CSV)
- ✅ Real-time error handling
- ✅ Optimized for Vercel deployment

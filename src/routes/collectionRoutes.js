import express from 'express';
import { CollectionController } from '../controllers/collectionController.js';
import { DocumentController } from '../controllers/documentController.js';

const router = express.Router();
const collectionController = new CollectionController();
const documentController = new DocumentController();

// Collection management routes
router.get('/', collectionController.getAllCollections);
router.post('/', collectionController.createCollection);
router.delete('/:name', collectionController.dropCollection);
router.put('/:name/rename', collectionController.renameCollection);

// IMPORTANT: Specific routes must come before generic :name routes
// Collection-specific endpoints
router.get('/:name/search', documentController.searchDocuments);
router.get('/:name/schema', collectionController.getCollectionSchema);
router.get('/:name/stats', collectionController.getCollectionStats);
router.get('/:name/indexes', collectionController.getCollectionIndexes);
router.get('/:name/export', collectionController.exportCollection);

// Document management routes
router.get('/:name/:id', documentController.getDocumentById);
router.post('/:name', documentController.addDocument);
router.delete('/:name/:id', documentController.deleteDocument);
router.put('/:name/:id', documentController.updateDocument);

// Generic collection route (must be last)
router.get('/:name', documentController.getDocuments);

export default router;

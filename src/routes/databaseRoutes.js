import express from 'express';
import { DatabaseController } from '../controllers/databaseController.js';

const router = express.Router();
const databaseController = new DatabaseController();

// Get database statistics
router.get('/stats', databaseController.getStats);

export default router;

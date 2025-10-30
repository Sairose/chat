import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleBasedAuth.js';
import adminController from '../controller/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/stats', auth, adminOnly, adminController.stats);

export { adminRouter };

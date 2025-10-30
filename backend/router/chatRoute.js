import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import chatController from '../controller/chatController.js';

const chatRouter = express.Router();

chatRouter.get('/', auth, chatController.getAllChats);
chatRouter.get('/count', auth, chatController.getChatCount);


export { chatRouter };

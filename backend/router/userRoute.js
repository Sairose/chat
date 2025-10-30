import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import userController from '../controller/userController.js';

const userRouter = express.Router();

userRouter.get('/', auth, userController.getAllUsers); // admin can call; we will check admin client-side or server-side filtering
userRouter.get('/me', auth, userController.getUser);
userRouter.put('/:id', auth, userController.updateUser);
userRouter.delete('/:id', auth, userController.deleteUser);

export { userRouter };

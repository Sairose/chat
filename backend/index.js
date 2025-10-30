// backend/index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';


import {connectDB} from './config/db.js';
import { setupSocket } from './socket/socket.js';
import { authRouter } from './router/authRoute.js';
import { userRouter } from './router/userRoute.js';
import { chatRouter } from './router/chatRoute.js';
import { adminRouter } from './router/adminRoute.js';


// Initialize dotenv
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = setupSocket(server);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/admin', adminRouter);


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import { Server } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Chat } from '../models/ChatModels.js';
import { User } from '../models/UserModels.js';

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // frontend origin
      credentials: true,               // allow cookies
    },
  });

  io.use(async (socket, next) => {
    try {
      // Parse cookies
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error('No cookies found'));
      const parsed = cookie.parse(cookies);
      const token = parsed.token;
      if (!token) return next(new Error('No token found'));

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      // Attach user info to socket
      socket.user = user;
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}, user: ${socket.user.name}`);

    socket.join('global');

    // Handle chat message
    socket.on('sendMessage', async ({ message }) => {
      if (!message.trim()) return;

      const chat = await Chat.create({
        sender: socket.user._id,
        message,
        room: 'global',
      });

      await chat.populate('sender', 'name');

      io.to('global').emit('receiveMessage', {
        _id: chat._id,
        sender: { id: chat.sender._id, name: chat.sender.name },
        message: chat.message,
        createdAt: chat.createdAt,
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export { setupSocket };

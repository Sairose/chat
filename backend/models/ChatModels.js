import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  room: { 
    type: String, 
    default: 'global' 
  } // keep a room if later multi-room is needed
}, { timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);

export {Chat};
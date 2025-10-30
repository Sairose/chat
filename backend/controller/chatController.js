import { Chat } from "../models/ChatModels.js";


const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('sender', 'name email').sort({ createdAt: -1 }).limit(100);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getChatCount = async (req, res) => {
  try {
    const totalChats = await Chat.countDocuments();
    res.json({ totalChats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { getAllChats, getChatCount };

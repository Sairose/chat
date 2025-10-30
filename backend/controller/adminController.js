import { Chat } from "../models/ChatModels.js";
import { User } from "../models/UserModels.js";

const stats = async (req, res) => {
  try {
    // Count only non-admin users
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalChats = await Chat.countDocuments();

    res.json({ totalUsers, totalChats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { stats };

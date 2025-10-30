import { User } from "../models/UserModels.js";


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  res.json(req.user); // set by authMiddleware
};

const updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // only admin can change roles; regular users can update their own name/email via a different endpoint
    if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    if (role && req.user.role === 'admin') user.role = role;

    await user.save();
    res.json({ message: 'User updated', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    // only admin or user himself can delete
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export default { getAllUsers, getUser, updateUser, deleteUser };
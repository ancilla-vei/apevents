const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const msg = await Message.create({ sender: req.user._id, receiver: receiverId, content });
    res.status(201).json(await msg.populate(['sender', 'receiver']));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const msgs = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).populate('sender', 'name role').sort('createdAt');
    // Mark as read
    await Message.updateMany({ sender: userId, receiver: req.user._id, read: false }, { read: true });
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAdminId = async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('_id name');
    res.json(admin);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCustomerList = async (req, res) => {
  try {
    // Admin: get list of customers who have messaged
    const msgs = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).populate('sender receiver', 'name role phone');
    const seen = new Set();
    const customers = [];
    msgs.forEach(m => {
      const other = m.sender._id.toString() === req.user._id.toString() ? m.receiver : m.sender;
      if (!seen.has(other._id.toString()) && other.role === 'customer') {
        seen.add(other._id.toString());
        customers.push(other);
      }
    });
    res.json(customers);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

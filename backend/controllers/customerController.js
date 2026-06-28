const User = require('../models/User');

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort('-createdAt');
    res.json(customers);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

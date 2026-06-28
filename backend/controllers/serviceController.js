const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort('order');
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort('order');
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createService = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;
    const image = req.file ? req.file.path : null;  // ✅ changed
    const s = await Service.create({ name, description, icon, image, order });
    res.status(201).json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateService = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = req.file.path;     // ✅ changed
    const s = await Service.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
const Quotation = require('../models/Quotation');

exports.createQuotation = async (req, res) => {
  try {
    const q = await Quotation.create(req.body);
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllQuotations = async (req, res) => {
  try {
    const qs = await Quotation.find().populate('customer', 'name phone email').populate('booking').sort('-createdAt');
    res.json(qs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyQuotations = async (req, res) => {
  try {
    const qs = await Quotation.find({ customer: req.user._id }).populate('booking').sort('-createdAt');
    res.json(qs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const q = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteQuotation = async (req, res) => {
  try {
    await Quotation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quotation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

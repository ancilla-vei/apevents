const Enquiry = require('../models/Enquiry');

exports.submitEnquiry = async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    const e = await Enquiry.create({ name, phone, message });
    res.status(201).json(e);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const es = await Enquiry.find().sort('-createdAt');
    res.json(es);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.replyEnquiry = async (req, res) => {
  try {
    const { adminReply } = req.body;
    const e = await Enquiry.findByIdAndUpdate(req.params.id, {
      adminReply, status: 'replied', repliedAt: new Date()
    }, { new: true });
    res.json(e);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

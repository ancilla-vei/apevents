const Testimonial = require('../models/Testimonial');

exports.submitTestimonial = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const t = await Testimonial.create({
      customer: req.user._id,
      name: req.user.name,
      rating, text, approved: false
    });
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApprovedTestimonials = async (req, res) => {
  try {
    const ts = await Testimonial.find({ approved: true }).sort('-createdAt');
    res.json(ts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const ts = await Testimonial.find().populate('customer', 'name').sort('-createdAt');
    res.json(ts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

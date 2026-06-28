const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  description: { type: String },
  eventName: { type: String },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  guestCount: { type: Number, required: true },
  venue: { type: String, required: true },
  address: { type: String, required: true },
  budget: { type: Number, required: true },
  decorDemands: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'complete', 'cancelled'], default: 'pending' },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);

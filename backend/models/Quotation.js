const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  title: { type: String, required: true },
  items: [{
    service: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  validUntil: { type: Date },
  notes: { type: String },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected'], default: 'sent' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', quotationSchema);

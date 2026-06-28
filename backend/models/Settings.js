const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'AP Events' },
  tagline: { type: String, default: 'Creating celebrations that live in your memories forever.' },
  logo: { type: String },
  backgroundImage: { type: String },
  missionStatement: { type: String, default: 'To deliver unforgettable event experiences with passion, creativity, and excellence.' },
  coreValues: { type: [String], default: ['Creativity', 'Excellence', 'Trust', 'Passion'] },
  phone: { type: String, default: '7411185509' },
  email: { type: String, default: 'info@apevents.in' },
  whatsapp: { type: String, default: '7411185509' },
  instagram: { type: String, default: '@apevents' },
  address: { type: String, default: 'Mangaluru, Karnataka, India' },
  primaryColor: { type: String, default: '#800000' },
  secondaryColor: { type: String, default: '#b22222' },
  accentColor: { type: String, default: '#ffd700' },
  darkMode: { type: Boolean, default: false },

  // ✅ Stats shown in the About section on the homepage
  statsEventsHosted:      { type: String, default: '100+' },
  statsHappyGuests:       { type: String, default: '500+' },
  statsYearsOfExcellence: { type: String, default: '1'   },
  statsClientSupport:     { type: String, default: '24/7' },
});

module.exports = mongoose.model('Settings', settingsSchema);
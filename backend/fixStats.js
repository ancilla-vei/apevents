// Run from your backend root: node scripts/fixStats.js
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected...');

  // Raw update — bypasses Mongoose schema, directly sets fields in MongoDB
  const result = await mongoose.connection.collection('settings').updateMany(
    {},
    {
      $set: {
        statsEventsHosted:      '100+',
        statsHappyGuests:       '500+',
        statsYearsOfExcellence: '1',
        statsClientSupport:     '24/7',
      }
    }
  );

  console.log('✅ Documents updated:', result.modifiedCount);

  // Verify what's now in the DB
  const doc = await mongoose.connection.collection('settings').findOne({});
  console.log('✅ Stats now in DB:', {
    statsEventsHosted:      doc.statsEventsHosted,
    statsHappyGuests:       doc.statsHappyGuests,
    statsYearsOfExcellence: doc.statsYearsOfExcellence,
    statsClientSupport:     doc.statsClientSupport,
  });

  mongoose.disconnect();
}).catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
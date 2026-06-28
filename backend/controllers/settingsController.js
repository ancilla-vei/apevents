const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) s = await Settings.create({});

    // ✅ Backfill missing stats fields on the existing document
    const needsSave =
      s.statsEventsHosted      == null ||
      s.statsHappyGuests       == null ||
      s.statsYearsOfExcellence == null ||
      s.statsClientSupport     == null;

    if (needsSave) {
      if (s.statsEventsHosted      == null) s.statsEventsHosted      = '100+';
      if (s.statsHappyGuests       == null) s.statsHappyGuests       = '500+';
      if (s.statsYearsOfExcellence == null) s.statsYearsOfExcellence = '1';
      if (s.statsClientSupport     == null) s.statsClientSupport     = '24/7';
      await s.save();
    }

    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const body = req.body;

    // Build a clean update object with proper types
    const update = {
      companyName:            body.companyName,
      tagline:                body.tagline,
      missionStatement:       body.missionStatement,
      phone:                  body.phone,
      email:                  body.email,
      whatsapp:               body.whatsapp,
      instagram:              body.instagram,
      address:                body.address,
      primaryColor:           body.primaryColor,
      secondaryColor:         body.secondaryColor,
      accentColor:            body.accentColor,

      // ✅ Boolean — FormData sends "true"/"false" strings
      darkMode: body.darkMode === 'true',

      // ✅ Array — FormData may send one string or an array
      coreValues: Array.isArray(body.coreValues)
        ? body.coreValues
        : body.coreValues
          ? body.coreValues.split(',').map(v => v.trim()).filter(Boolean)
          : [],

      // ✅ Stats fields
      statsEventsHosted:      body.statsEventsHosted,
      statsHappyGuests:       body.statsHappyGuests,
      statsYearsOfExcellence: body.statsYearsOfExcellence,
      statsClientSupport:     body.statsClientSupport,
    };

    // Remove undefined keys so we don't overwrite with undefined
    Object.keys(update).forEach(k => {
      if (update[k] === undefined) delete update[k];
    });

    // Handle uploaded files
    if (req.files?.['logo'])
      update.logo = `/uploads/${req.files['logo'][0].filename}`;
    if (req.files?.['backgroundImage'])
      update.backgroundImage = `/uploads/${req.files['backgroundImage'][0].filename}`;

    let s = await Settings.findOne();
    if (!s) {
      s = await Settings.create(update);
    } else {
      Object.assign(s, update);
      await s.save();
    }

    res.json(s);
  } catch (err) {
    console.error('updateSettings error:', err);
    res.status(500).json({ message: err.message });
  }
};
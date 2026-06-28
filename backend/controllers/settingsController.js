const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) s = await Settings.create({});

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
      darkMode:               body.darkMode === 'true',
      coreValues: Array.isArray(body.coreValues)
        ? body.coreValues
        : body.coreValues
          ? body.coreValues.split(',').map(v => v.trim()).filter(Boolean)
          : [],
      statsEventsHosted:      body.statsEventsHosted,
      statsHappyGuests:       body.statsHappyGuests,
      statsYearsOfExcellence: body.statsYearsOfExcellence,
      statsClientSupport:     body.statsClientSupport,
    };

    Object.keys(update).forEach(k => {
      if (update[k] === undefined) delete update[k];
    });

    // ✅ changed both lines below
    if (req.files?.['logo'])
      update.logo = req.files['logo'][0].path;
    if (req.files?.['backgroundImage'])
      update.backgroundImage = req.files['backgroundImage'][0].path;

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
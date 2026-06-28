const Gallery = require('../models/Gallery');

exports.getGallery = async (req, res) => {
  try {
    res.json(await Gallery.find().sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image required' });
    const g = await Gallery.create({
      image: `/uploads/${req.file.filename}`,
      description: req.body.description,
      eventName: req.body.eventName,
      featured: req.body.featured === 'true'
    });
    res.status(201).json(g);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateImage = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    res.json(await Gallery.findByIdAndUpdate(req.params.id, update, { new: true }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

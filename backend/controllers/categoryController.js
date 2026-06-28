// Categories Controller
const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    res.json(await Category.find({ active: true }).sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllCategories = async (req, res) => {
  try {
    res.json(await Category.find().sort('-createdAt'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createCategory = async (req, res) => {
  try {
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const c = await Category.create({ ...req.body, photo });
    res.status(201).json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCategory = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.photo = `/uploads/${req.file.filename}`;
    res.json(await Category.findByIdAndUpdate(req.params.id, update, { new: true }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.categoryController = { getCategories: exports.getCategories, getAllCategories: exports.getAllCategories, createCategory: exports.createCategory, updateCategory: exports.updateCategory, deleteCategory: exports.deleteCategory };

const router = require('express').Router();
const c = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/public', c.getCategories);
router.get('/', protect, adminOnly, c.getAllCategories);
router.post('/', protect, adminOnly, upload.single('photo'), c.createCategory);
router.put('/:id', protect, adminOnly, upload.single('photo'), c.updateCategory);
router.delete('/:id', protect, adminOnly, c.deleteCategory);

module.exports = router;

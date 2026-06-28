const router = require('express').Router();
const c = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/public', c.getServices);
router.get('/', protect, adminOnly, c.getAllServices);
router.post('/', protect, adminOnly, upload.single('image'), c.createService);
router.put('/:id', protect, adminOnly, upload.single('image'), c.updateService);
router.delete('/:id', protect, adminOnly, c.deleteService);

module.exports = router;

const router = require('express').Router();
const c = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', c.getGallery);
router.post('/', protect, adminOnly, upload.single('image'), c.addImage);
router.put('/:id', protect, adminOnly, upload.single('image'), c.updateImage);
router.delete('/:id', protect, adminOnly, c.deleteImage);

module.exports = router;

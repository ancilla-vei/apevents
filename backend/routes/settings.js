const router = require('express').Router();
const c = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', c.getSettings);
router.put('/', protect, adminOnly, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), c.updateSettings);

module.exports = router;

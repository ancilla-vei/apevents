const router = require('express').Router();
const c = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', c.submitEnquiry);
router.get('/', protect, adminOnly, c.getAllEnquiries);
router.put('/:id/reply', protect, adminOnly, c.replyEnquiry);
router.delete('/:id', protect, adminOnly, c.deleteEnquiry);

module.exports = router;

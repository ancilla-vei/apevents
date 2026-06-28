const router = require('express').Router();
const c = require('../controllers/messageController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, c.sendMessage);
router.get('/admin', protect, c.getAdminId);
router.get('/customers', protect, adminOnly, c.getCustomerList);
router.get('/:userId', protect, c.getConversation);

module.exports = router;

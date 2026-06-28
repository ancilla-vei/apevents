const router = require('express').Router();
const c = require('../controllers/customerController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, c.getAllCustomers);
router.delete('/:id', protect, adminOnly, c.deleteCustomer);

module.exports = router;

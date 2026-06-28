// quotations.js
const router = require('express').Router();
const c = require('../controllers/quotationController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/my', protect, c.getMyQuotations);
router.get('/', protect, adminOnly, c.getAllQuotations);
router.post('/', protect, adminOnly, c.createQuotation);
router.put('/:id', protect, adminOnly, c.updateQuotation);
router.delete('/:id', protect, adminOnly, c.deleteQuotation);

module.exports = router;

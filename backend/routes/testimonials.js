const router = require('express').Router();
const c = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/public', c.getApprovedTestimonials);
router.post('/', protect, c.submitTestimonial);
router.get('/', protect, adminOnly, c.getAllTestimonials);
router.put('/:id/approve', protect, adminOnly, c.approveTestimonial);
router.delete('/:id', protect, adminOnly, c.deleteTestimonial);

module.exports = router;

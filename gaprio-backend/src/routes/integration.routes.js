const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const integrationController = require('../controllers/integration.controller');

router.get('/google/dashboard', protect, integrationController.getGoogleData);
router.post('/google/email/send', protect, integrationController.sendEmail);     // NEW
router.post('/google/calendar/create', protect, integrationController.createMeeting); // NEW


router.get('/slack/channels', protect, integrationController.getSlackData);
router.post('/slack/message', protect, integrationController.sendSlackMessage);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const integrationController = require('../controllers/integration.controller');

router.get('/google/dashboard', protect, integrationController.getGoogleData);
router.post('/google/email/send', protect, integrationController.sendEmail);
router.post('/google/calendar/create', protect, integrationController.createMeeting);

router.get('/slack/channels', protect, integrationController.getSlackData);
router.post('/slack/message', protect, integrationController.sendSlackMessage);

router.get('/asana/dashboard', protect, integrationController.getAsanaData);

router.get('/miro/boards', protect, integrationController.getMiroData);

router.get('/jira/issues', protect, integrationController.getJiraData);

router.get('/zoho/deals', protect, integrationController.getZohoData);

module.exports = router;
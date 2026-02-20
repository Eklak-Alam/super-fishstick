const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const integrationController = require('../controllers/integration.controller');

// ===========================
// 🟢 GOOGLE ROUTES
// ===========================
router.get('/google/dashboard', protect, integrationController.getGoogleData);
router.post('/google/email/send', protect, integrationController.sendEmail);
router.post('/google/email/draft', protect, integrationController.createDraft);
router.post('/google/calendar/create', protect, integrationController.createMeeting);

// ===========================
// 🟣 SLACK ROUTES 
// ===========================
router.get('/slack/channels', protect, integrationController.getSlackData); 
router.get('/slack/messages', protect, integrationController.getSlackMessages);
router.post('/slack/message', protect, integrationController.sendSlackMessage);
router.put('/slack/message', protect, integrationController.updateSlackMessage);
router.delete('/slack/message', protect, integrationController.deleteSlackMessage);
router.post('/slack/channel/create', protect, integrationController.createSlackChannel);
router.post('/slack/dm/open', protect, integrationController.openSlackDM);

// ===========================
// 🟠 ASANA ROUTES (FULL CRUD)
// ===========================
router.get('/asana/dashboard', protect, integrationController.getAsanaData);
router.post('/asana/tasks', protect, integrationController.createAsanaTask);
router.put('/asana/tasks/:taskId', protect, integrationController.updateAsanaTask);        // 👈 NEW: Edit Task
router.delete('/asana/tasks/:taskId', protect, integrationController.deleteAsanaTask);     // 👈 NEW: Delete Task
router.put('/asana/tasks/:taskId/complete', protect, integrationController.completeAsanaTask);
router.post('/asana/projects', protect, integrationController.createAsanaProject);
router.delete('/asana/projects/:projectId', protect, integrationController.deleteAsanaProject);

// ===========================
// 🎨 MIRO ROUTES
// ===========================
router.get('/miro/boards', protect, integrationController.getMiroData);
router.post('/miro/boards', protect, integrationController.createMiroBoard);

// ===========================
// 🐞 JIRA ROUTES
// ===========================
router.get('/jira/issues', protect, integrationController.getJiraData);
router.post('/jira/issues', protect, integrationController.createJiraIssue);
router.post('/jira/issues/:issueKey/comment', protect, integrationController.addJiraComment);

// ===========================
// 💼 ZOHO ROUTES
// ===========================
router.get('/zoho/deals', protect, integrationController.getZohoData);
router.post('/zoho/deals', protect, integrationController.createZohoDeal);
router.post('/zoho/leads', protect, integrationController.createZohoLead);

module.exports = router;
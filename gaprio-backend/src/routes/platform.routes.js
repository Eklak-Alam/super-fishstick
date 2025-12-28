const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platform.controller');

// Google Auth Routes
router.get('/auth/google', platformController.googleAuth);
router.get('/auth/google/callback', platformController.googleCallback);


// Slack Auth Routes
router.get('/auth/slack', platformController.slackAuth);
router.get('/auth/slack/callback', platformController.slackCallback);


// Asana Auth Routes
router.get('/auth/asana', platformController.asanaAuth);
router.get('/auth/asana/callback', platformController.asanaCallback);

//miro Auth Routes
router.get('/auth/miro', platformController.miroAuth);
router.get('/auth/miro/callback', platformController.miroCallback);


//Jira Auth Routes
router.get('/auth/jira', platformController.jiraAuth);
router.get('/auth/jira/callback', platformController.jiraCallback);


// Zoho Auth Routes (NEW)
router.get('/auth/zoho', platformController.zohoAuth);
router.get('/auth/zoho/callback', platformController.zohoCallback);

module.exports = router;
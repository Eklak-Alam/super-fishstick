const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platform.controller');

// Google Auth Routes
router.get('/auth/google', platformController.googleAuth);
router.get('/auth/google/callback', platformController.googleCallback);


// Slack Auth Routes
router.get('/auth/slack', platformController.slackAuth);
router.get('/auth/slack/callback', platformController.slackCallback);

module.exports = router;
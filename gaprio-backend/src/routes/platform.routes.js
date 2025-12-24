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

module.exports = router;
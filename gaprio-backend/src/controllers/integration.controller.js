const GoogleService = require('../services/providers/google.service');
const SlackService = require('../services/providers/slack.service');
const AsanaService = require('../services/providers/asana.service');

// ==========================================
// 🟢 GOOGLE INTEGRATIONS
// ==========================================

// Get Dashboard Data (Emails, Files, Meetings)
exports.getGoogleData = async (req, res) => {
    try {
        const [emails, files, meetings] = await Promise.all([
            GoogleService.getRecentEmails(req.user.id),
            GoogleService.getRecentFiles(req.user.id),
            GoogleService.getUpcomingMeetings(req.user.id)
        ]);

        res.status(200).json({ success: true, data: { emails, files, meetings } });
    } catch (error) {
        console.error("Google Fetch Error:", error.message);
        // Return empty structure on error to prevent frontend crash
        res.status(200).json({ success: true, data: { emails: [], files: [], meetings: [] } });
    }
};

// Send Email
exports.sendEmail = async (req, res, next) => {
    try {
        await GoogleService.sendEmail(req.user.id, req.body);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        next(error);
    }
};

// Create Calendar Meeting
exports.createMeeting = async (req, res, next) => {
    try {
        await GoogleService.createMeeting(req.user.id, req.body);
        res.status(200).json({ success: true, message: 'Meeting scheduled successfully' });
    } catch (error) {
        next(error);
    }
};


// ==========================================
// 🟣 SLACK INTEGRATIONS
// ==========================================

// Get Slack Channels
exports.getSlackData = async (req, res, next) => {
    try {
        const channels = await SlackService.getChannels(req.user.id);
        res.status(200).json({ success: true, data: { channels } });
    } catch (error) {
        console.error("Slack Fetch Error:", error.message);
        res.status(200).json({ success: true, data: { channels: [] } });
    }
};

// Send Slack Message
exports.sendSlackMessage = async (req, res, next) => {
    try {
        await SlackService.sendMessage(req.user.id, req.body);
        res.status(200).json({ success: true, message: 'Message sent to Slack' });
    } catch (error) {
        next(error);
    }
};


// ==========================================
// 🟠 ASANA INTEGRATIONS
// ==========================================

// Get Asana Data (Projects & Tasks)
exports.getAsanaData = async (req, res) => {
    try {
        const [projects, tasks] = await Promise.all([
            AsanaService.getProjects(req.user.id),
            AsanaService.getTasks(req.user.id)
        ]);

        res.status(200).json({ 
            success: true, 
            data: { projects, tasks } 
        });
    } catch (error) {
        console.error("Asana Data Error:", error.message);
        res.status(200).json({ success: true, data: { projects: [], tasks: [] } });
    }
};
const GoogleService = require('../services/providers/google.service');
const SlackService = require('../services/providers/slack.service');
const AsanaService = require('../services/providers/asana.service');
const MiroService = require('../services/providers/miro.service');
const JiraService = require('../services/providers/jira.service');
const ZohoService = require('../services/providers/zoho.service');

// ==========================================
// 🟢 GOOGLE WORKSPACE
// ==========================================

exports.getGoogleData = async (req, res, next) => {
    try {
        const [emails, files, meetings] = await Promise.all([
            GoogleService.getRecentEmails(req.user.id),
            GoogleService.getRecentFiles(req.user.id),
            GoogleService.getUpcomingMeetings(req.user.id)
        ]);
        res.status(200).json({ success: true, data: { emails, files, meetings } });
    } catch (error) {
        // Return empty data instead of 500 to keep dashboard alive
        console.error("Google Data Error:", error.message);
        res.status(200).json({ success: true, data: { emails: [], files: [], meetings: [] } });
    }
};

exports.sendEmail = async (req, res, next) => {
    try {
        await GoogleService.sendEmail(req.user.id, req.body);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) { next(error); }
};

exports.createDraft = async (req, res, next) => {
    try {
        const result = await GoogleService.createDraft(req.user.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
};

exports.createMeeting = async (req, res, next) => {
    try {
        const result = await GoogleService.createMeeting(req.user.id, req.body);
        res.status(200).json({ success: true, data: result, message: 'Meeting scheduled' });
    } catch (error) { next(error); }
};

// ==========================================
// 🟣 SLACK
// ==========================================

exports.getSlackData = async (req, res, next) => {
    try {
        const channels = await SlackService.getChannels(req.user.id);
        res.status(200).json({ success: true, data: { channels } });
    } catch (error) {
        console.error("Slack Data Error:", error.message);
        res.status(200).json({ success: true, data: { channels: [] } });
    }
};

exports.getSlackUsers = async (req, res, next) => {
    try {
        const users = await SlackService.getUsers(req.user.id);
        res.status(200).json({ success: true, data: users });
    } catch (error) { next(error); }
};

exports.sendSlackMessage = async (req, res, next) => {
    try {
        await SlackService.sendMessage(req.user.id, req.body);
        res.status(200).json({ success: true, message: 'Message sent' });
    } catch (error) { next(error); }
};

// ==========================================
// 🟠 ASANA
// ==========================================

exports.getAsanaData = async (req, res, next) => {
    try {
        const [projects, tasks] = await Promise.all([
            AsanaService.getProjects(req.user.id),
            AsanaService.getTasks(req.user.id)
        ]);
        res.status(200).json({ success: true, data: { projects, tasks } });
    } catch (error) {
        console.error("Asana Data Error:", error.message);
        res.status(200).json({ success: true, data: { projects: [], tasks: [] } });
    }
};

exports.createAsanaTask = async (req, res, next) => {
    try {
        const task = await AsanaService.createTask(req.user.id, req.body);
        res.status(200).json({ success: true, data: task });
    } catch (error) { next(error); }
};

exports.completeAsanaTask = async (req, res, next) => {
    try {
        await AsanaService.completeTask(req.user.id, req.params.taskId);
        res.status(200).json({ success: true, message: 'Task completed' });
    } catch (error) { next(error); }
};

// ==========================================
// 🎨 MIRO
// ==========================================

exports.getMiroData = async (req, res, next) => {
    try {
        const boards = await MiroService.getBoards(req.user.id);
        res.status(200).json({ success: true, data: { boards } });
    } catch (error) {
        console.error("Miro Data Error:", error.message);
        res.status(200).json({ success: true, data: { boards: [] } });
    }
};

exports.createMiroBoard = async (req, res, next) => {
    try {
        const board = await MiroService.createBoard(req.user.id, req.body);
        res.status(200).json({ success: true, data: board });
    } catch (error) { next(error); }
};

// ==========================================
// 🐞 JIRA
// ==========================================

exports.getJiraData = async (req, res, next) => {
    try {
        const issues = await JiraService.getIssues(req.user.id);
        res.status(200).json({ success: true, data: { issues } });
    } catch (error) {
        console.error("Jira Data Error:", error.message);
        res.status(200).json({ success: true, data: { issues: [] } });
    }
};

exports.createJiraIssue = async (req, res, next) => {
    try {
        const issue = await JiraService.createIssue(req.user.id, req.body);
        res.status(200).json({ success: true, data: issue });
    } catch (error) { next(error); }
};

exports.addJiraComment = async (req, res, next) => {
    try {
        await JiraService.addComment(req.user.id, req.params.issueKey, req.body.comment);
        res.status(200).json({ success: true, message: 'Comment added' });
    } catch (error) { next(error); }
};

// ==========================================
// 💼 ZOHO
// ==========================================

exports.getZohoData = async (req, res, next) => {
    try {
        const deals = await ZohoService.getDeals(req.user.id);
        res.status(200).json({ success: true, data: { deals } });
    } catch (error) {
        console.error("Zoho Data Error:", error.message);
        res.status(200).json({ success: true, data: { deals: [] } });
    }
};

exports.createZohoDeal = async (req, res, next) => {
    try {
        const deal = await ZohoService.createDeal(req.user.id, req.body);
        res.status(200).json({ success: true, data: deal });
    } catch (error) { next(error); }
};

exports.createZohoLead = async (req, res, next) => {
    try {
        const lead = await ZohoService.createLead(req.user.id, req.body);
        res.status(200).json({ success: true, data: lead });
    } catch (error) { next(error); }
};
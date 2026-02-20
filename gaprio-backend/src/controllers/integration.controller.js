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
        const workspaceData = await SlackService.getWorkspaceData(req.user.id);
        res.status(200).json({ success: true, data: workspaceData }); 
    } catch (error) {
        console.error("Slack Data Error:", error.message);
        res.status(200).json({ success: true, data: { channels: [], users: [] } });
    }
};

exports.getSlackMessages = async (req, res, next) => {
    try {
        const messages = await SlackService.getMessages(req.user.id, req.query.channelId);
        res.status(200).json({ success: true, data: messages });
    } catch (error) { next(error); }
};

exports.sendSlackMessage = async (req, res, next) => {
    try {
        const result = await SlackService.sendMessage(req.user.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
};

exports.updateSlackMessage = async (req, res, next) => {
    try {
        const result = await SlackService.updateMessage(req.user.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
};

exports.deleteSlackMessage = async (req, res, next) => {
    try {
        const result = await SlackService.deleteMessage(req.user.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
};

exports.createSlackChannel = async (req, res, next) => {
    try {
        const result = await SlackService.createChannel(req.user.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
};

exports.openSlackDM = async (req, res, next) => {
    try {
        const channelId = await SlackService.openDM(req.user.id, req.body.targetUserId);
        res.status(200).json({ success: true, channelId });
    } catch (error) { next(error); }
};

// ==========================================
// 🟠 ASANA (NOW WITH FULL CRUD)
// ==========================================
exports.getAsanaData = async (req, res, next) => {
    try {
        const [projects, tasks] = await Promise.all([AsanaService.getProjects(req.user.id), AsanaService.getTasks(req.user.id)]);
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

// NEW: Update Task
exports.updateAsanaTask = async (req, res, next) => {
    try { 
        const task = await AsanaService.updateTask(req.user.id, req.params.taskId, req.body); 
        res.status(200).json({ success: true, data: task, message: 'Task updated' }); 
    } catch (error) { next(error); }
};

// NEW: Delete Task
exports.deleteAsanaTask = async (req, res, next) => {
    try { 
        const result = await AsanaService.deleteTask(req.user.id, req.params.taskId); 
        res.status(200).json(result); 
    } catch (error) { next(error); }
};

// Mark Complete
exports.completeAsanaTask = async (req, res, next) => {
    try { 
        await AsanaService.completeTask(req.user.id, req.params.taskId); 
        res.status(200).json({ success: true, message: 'Task completed' }); 
    } catch (error) { next(error); }
};

// Add these to integration.controller.js
exports.createAsanaProject = async (req, res, next) => {
    try { 
        const project = await AsanaService.createProject(req.user.id, req.body); 
        res.status(200).json({ success: true, data: project }); 
    } catch (error) { next(error); }
};

exports.deleteAsanaProject = async (req, res, next) => {
    try { 
        const result = await AsanaService.deleteProject(req.user.id, req.params.projectId); 
        res.status(200).json(result); 
    } catch (error) { next(error); }
};

// ==========================================
// 🎨 MIRO
// ==========================================
exports.getMiroData = async (req, res, next) => {
    try { const boards = await MiroService.getBoards(req.user.id); res.status(200).json({ success: true, data: { boards } }); } catch (error) { res.status(200).json({ success: true, data: { boards: [] } }); }
};

exports.createMiroBoard = async (req, res, next) => {
    try { const board = await MiroService.createBoard(req.user.id, req.body); res.status(200).json({ success: true, data: board }); } catch (error) { next(error); }
};

// ==========================================
// 🐞 JIRA
// ==========================================
exports.getJiraData = async (req, res, next) => {
    try { const issues = await JiraService.getIssues(req.user.id); res.status(200).json({ success: true, data: { issues } }); } catch (error) { res.status(200).json({ success: true, data: { issues: [] } }); }
};

exports.createJiraIssue = async (req, res, next) => {
    try { const issue = await JiraService.createIssue(req.user.id, req.body); res.status(200).json({ success: true, data: issue }); } catch (error) { next(error); }
};

exports.addJiraComment = async (req, res, next) => {
    try { await JiraService.addComment(req.user.id, req.params.issueKey, req.body.comment); res.status(200).json({ success: true, message: 'Comment added' }); } catch (error) { next(error); }
};

// ==========================================
// 💼 ZOHO
// ==========================================
exports.getZohoData = async (req, res, next) => {
    try { const deals = await ZohoService.getDeals(req.user.id); res.status(200).json({ success: true, data: { deals } }); } catch (error) { res.status(200).json({ success: true, data: { deals: [] } }); }
};

exports.createZohoDeal = async (req, res, next) => {
    try { const deal = await ZohoService.createDeal(req.user.id, req.body); res.status(200).json({ success: true, data: deal }); } catch (error) { next(error); }
};

exports.createZohoLead = async (req, res, next) => {
    try { const lead = await ZohoService.createLead(req.user.id, req.body); res.status(200).json({ success: true, data : lead }); } catch (error) { next(error); }
};
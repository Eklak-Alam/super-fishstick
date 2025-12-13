const GoogleService = require('../services/providers/google.service');

// 1. Get Dashboard Data (Updated to include Calendar)
exports.getGoogleData = async (req, res) => {
    try {
        const [emails, files, meetings] = await Promise.all([
            GoogleService.getRecentEmails(req.user.id),
            GoogleService.getRecentFiles(req.user.id),
            GoogleService.getUpcomingMeetings(req.user.id)
        ]);

        res.status(200).json({ success: true, data: { emails, files, meetings } });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(200).json({ success: true, data: { emails: [], files: [], meetings: [], connected: false } });
    }
};

// 2. Send Email
exports.sendEmail = async (req, res, next) => {
    try {
        await GoogleService.sendEmail(req.user.id, req.body);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        next(error);
    }
};

// 3. Create Meeting
exports.createMeeting = async (req, res, next) => {
    try {
        const meeting = await GoogleService.createMeeting(req.user.id, req.body);
        res.status(200).json({ success: true, data: meeting });
    } catch (error) {
        next(error);
    }
};
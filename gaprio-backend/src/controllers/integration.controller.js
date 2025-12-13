const GoogleService = require('../services/providers/google.service');

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
        console.error("Fetch Error:", error);
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
        const meeting = await GoogleService.createMeeting(req.user.id, req.body);
        res.status(200).json({ success: true, data: meeting });
    } catch (error) {
        next(error);
    }
};
const { google } = require('googleapis');
const stream = require('stream');
const ConnectionModel = require('../../models/connection.model');

class GoogleService {
    
    // ==========================================
    // 1. AUTH CONFIGURATION
    // ==========================================
    static getOAuthClient() {
        return new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }

    static getAuthURL(userId = null) {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            client_id: process.env.GOOGLE_CLIENT_ID,
            access_type: 'offline', // Essential for Refresh Token
            response_type: 'code',
            prompt: 'consent',
            // 🚨 "God Mode" Scopes Added Here
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://mail.google.com/',                     // Full Gmail Access
                'https://www.googleapis.com/auth/drive',        // Full Drive Access
                'https://www.googleapis.com/auth/calendar'      // Full Calendar Access
            ].join(' '),
            state: userId
        };
        return `${rootUrl}?${new URLSearchParams(options).toString()}`;
    }

    static async getTokens(code) {
        const { tokens } = await this.getOAuthClient().getToken(code);
        return tokens;
    }

    static async getUserInfo(accessToken) {
        const auth = this.getOAuthClient();
        auth.setCredentials({ access_token: accessToken });
        const { data } = await google.oauth2({ version: 'v2', auth }).userinfo.get();
        return data;
    }

    // ==========================================
    // 2. CORE CLIENT (WITH AUTO-REFRESH)
    // ==========================================
    static async getAuthenticatedClient(userId) {
        const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'google');
        if (!connection) throw new Error('Google account not connected');

        const oauth2Client = this.getOAuthClient();
        
        oauth2Client.setCredentials({
            access_token: connection.access_token,
            refresh_token: connection.refresh_token,
            expiry_date: new Date(connection.expires_at).getTime()
        });

        const isExpired = Date.now() >= (new Date(connection.expires_at).getTime() - 5 * 60 * 1000);

        if (isExpired && connection.refresh_token) {
            console.log(`🔄 Refreshing Google Token for User ${userId}...`);
            try {
                const { credentials } = await oauth2Client.refreshAccessToken();
                const newExpiresAt = new Date(credentials.expiry_date);
                
                await ConnectionModel.updateTokens(
                    userId, 
                    'google', 
                    credentials.access_token, 
                    credentials.refresh_token || connection.refresh_token, 
                    newExpiresAt
                );

                oauth2Client.setCredentials(credentials);
            } catch (err) {
                console.error("Google Refresh Failed:", err);
                throw new Error("Google re-authentication required");
            }
        }

        return oauth2Client;
    }

    // ==========================================
    // 3. GMAIL FEATURES (CRUD)
    // ==========================================
    
    // READ Emails
    static async getRecentEmails(userId, maxResults = 10) {
        const auth = await this.getAuthenticatedClient(userId);
        const gmail = google.gmail({ version: 'v1', auth });
        
        const response = await gmail.users.messages.list({ userId: 'me', maxResults, q: 'is:inbox' });
        const messages = response.data.messages || [];

        return Promise.all(messages.map(async (msg) => {
            const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
            const headers = detail.data.payload.headers;
            return { 
                id: msg.id, 
                threadId: msg.threadId,
                subject: headers.find(h => h.name === 'Subject')?.value || '(No Subject)', 
                from: headers.find(h => h.name === 'From')?.value || 'Unknown', 
                snippet: detail.data.snippet,
                date: headers.find(h => h.name === 'Date')?.value
            };
        }));
    }

    // CREATE (Send) Email
    static async sendEmail(userId, { to, subject, body }) {
        const auth = await this.getAuthenticatedClient(userId);
        const gmail = google.gmail({ version: 'v1', auth });

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `To: ${to}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            body
        ];
        const encodedMessage = Buffer.from(messageParts.join('\n')).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        await gmail.users.messages.send({ userId: 'me', requestBody: { raw: encodedMessage } });
        return { success: true };
    }

    // CREATE Draft
    static async createDraft(userId, { to, subject, body }) {
        const auth = await this.getAuthenticatedClient(userId);
        const gmail = google.gmail({ version: 'v1', auth });

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `To: ${to}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            body
        ];
        const encodedMessage = Buffer.from(messageParts.join('\n')).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const res = await gmail.users.drafts.create({ userId: 'me', requestBody: { message: { raw: encodedMessage } } });
        return { success: true, id: res.data.id };
    }

    // DELETE Email (Moves to Trash)
    static async deleteEmail(userId, messageId) {
        const auth = await this.getAuthenticatedClient(userId);
        const gmail = google.gmail({ version: 'v1', auth });

        await gmail.users.messages.trash({ userId: 'me', id: messageId });
        return { success: true, message: 'Email moved to trash' };
    }


    // ==========================================
    // 4. CALENDAR FEATURES (CRUD)
    // ==========================================

    // READ Meetings
    static async getUpcomingMeetings(userId, maxResults = 10) {
        const auth = await this.getAuthenticatedClient(userId);
        const calendar = google.calendar({ version: 'v3', auth });
        
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults,
            singleEvents: true,
            orderBy: 'startTime',
        });
        
        return response.data.items.map(event => ({
            id: event.id,
            summary: event.summary,
            start: event.start,
            end: event.end,
            link: event.hangoutLink || event.htmlLink,
            attendees: event.attendees || []
        }));
    }

    // CREATE Meeting
    static async createMeeting(userId, { summary, description, startTime, endTime, attendees = [] }) {
        const auth = await this.getAuthenticatedClient(userId);
        const calendar = google.calendar({ version: 'v3', auth });

        const event = {
            summary,
            description,
            start: { dateTime: new Date(startTime).toISOString() },
            end: { dateTime: new Date(endTime).toISOString() },
            attendees: attendees.map(email => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(36).substring(7),
                    conferenceSolutionKey: { type: 'hangoutsMeet' }
                }
            }
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1
        });

        return { id: response.data.id, link: response.data.hangoutLink, htmlLink: response.data.htmlLink };
    }

    // UPDATE Meeting
    static async updateMeeting(userId, eventId, { summary, description, startTime, endTime }) {
        const auth = await this.getAuthenticatedClient(userId);
        const calendar = google.calendar({ version: 'v3', auth });

        // First fetch the existing event to keep attendees/links intact
        const existingEvent = await calendar.events.get({ calendarId: 'primary', eventId });
        
        const updatedEvent = {
            ...existingEvent.data,
            summary: summary || existingEvent.data.summary,
            description: description || existingEvent.data.description,
            start: startTime ? { dateTime: new Date(startTime).toISOString() } : existingEvent.data.start,
            end: endTime ? { dateTime: new Date(endTime).toISOString() } : existingEvent.data.end,
        };

        const response = await calendar.events.update({
            calendarId: 'primary',
            eventId: eventId,
            resource: updatedEvent
        });

        return { success: true, id: response.data.id };
    }

    // DELETE Meeting
    static async deleteMeeting(userId, eventId) {
        const auth = await this.getAuthenticatedClient(userId);
        const calendar = google.calendar({ version: 'v3', auth });

        await calendar.events.delete({ calendarId: 'primary', eventId });
        return { success: true, message: 'Meeting canceled' };
    }


    // ==========================================
    // 5. DRIVE FEATURES (CRUD)
    // ==========================================

    // READ Files
    static async getRecentFiles(userId, maxResults = 10) {
        const auth = await this.getAuthenticatedClient(userId);
        const drive = google.drive({ version: 'v3', auth });
        
        const response = await drive.files.list({
            pageSize: maxResults,
            fields: 'files(id, name, mimeType, webViewLink, iconLink, modifiedTime)',
            orderBy: 'modifiedTime desc'
        });
        
        return response.data.files;
    }

    // CREATE (Upload) File
    static async uploadFile(userId, { name, mimeType, bufferText }) {
        const auth = await this.getAuthenticatedClient(userId);
        const drive = google.drive({ version: 'v3', auth });

        // Convert string/text buffer to a readable stream for Google API
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(bufferText));

        const response = await drive.files.create({
            requestBody: { name, mimeType },
            media: {
                mimeType: mimeType,
                body: bufferStream
            },
            fields: 'id, name, webViewLink'
        });

        return response.data;
    }

    // DELETE File
    static async deleteFile(userId, fileId) {
        const auth = await this.getAuthenticatedClient(userId);
        const drive = google.drive({ version: 'v3', auth });

        await drive.files.delete({ fileId });
        return { success: true, message: 'File deleted permanently' };
    }
}

module.exports = GoogleService;
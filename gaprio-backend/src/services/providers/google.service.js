const { google } = require('googleapis');
const ConnectionModel = require('../../models/connection.model');
// const db = require('../../config/db'); // Not strictly needed here if ConnectionModel handles DB

class GoogleService {
    
    // --- 1. Setup the OAuth2 Client ---
    static getOAuthClient() {
        return new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }

    // --- 2. Auth URL ---
    static getAuthURL(userId = null) {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            client_id: process.env.GOOGLE_CLIENT_ID,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                // 1. Identity
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                
                // 2. Gmail (Read/Send) - Added .send/compose if needed later, or stick to readonly + send
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/gmail.send', // Needed for sendEmail
                
                // 3. Drive (Read)
                'https://www.googleapis.com/auth/drive.readonly',
                'https://www.googleapis.com/auth/drive.metadata.readonly',
                
                // 4. Calendar (Read & WRITE)
                'https://www.googleapis.com/auth/calendar.readonly', 
                'https://www.googleapis.com/auth/calendar.events' // <--- CHANGED: Removed .readonly to allow creating events
            ].join(' '),
            state: userId
        };
        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`;
    }

    // --- 3. Get Tokens from Code ---
    static async getTokens(code) {
        const oauth2Client = this.getOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);
        return tokens;
    }

    // --- 4. Get User Info ---
    static async getUserInfo(accessToken) {
        const oauth2Client = this.getOAuthClient();
        oauth2Client.setCredentials({ access_token: accessToken });
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
        return data;
    }

    // --- 5. The Magic Authenticated Client ---
    static async getAuthenticatedClient(userId) {
        const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'google');
        if (!connection) throw new Error('Google account not connected');

        const oauth2Client = this.getOAuthClient();

        oauth2Client.setCredentials({
            access_token: connection.access_token,
            refresh_token: connection.refresh_token,
            expiry_date: new Date(connection.expires_at).getTime()
        });

        // Check if token is expired or about to expire (e.g., within 5 minutes)
        const isExpired = Date.now() >= (new Date(connection.expires_at).getTime() - 5 * 60 * 1000);

        if (isExpired && connection.refresh_token) {
            console.log("🔄 Refreshing Google Access Token...");
            try {
                // This method automatically uses the refresh token to get new credentials
                const { credentials } = await oauth2Client.refreshAccessToken();
                
                const newExpiresAt = new Date(credentials.expiry_date);
                
                await ConnectionModel.updateTokens(
                    userId, 
                    'google', 
                    credentials.access_token, 
                    credentials.refresh_token || null, // Google might return a new refresh token
                    newExpiresAt
                );

                oauth2Client.setCredentials(credentials);
            } catch (error) {
                console.error("Failed to refresh Google token:", error);
                throw new Error("Google authentication expired. Please reconnect.");
            }
        }

        return oauth2Client;
    }
    // --- 6. Feature Methods ---

    static async getRecentEmails(userId) {
        const auth = await this.getAuthenticatedClient(userId);
        const gmail = google.gmail({ version: 'v1', auth });
        
        const response = await gmail.users.messages.list({ userId: 'me', maxResults: 5 });
        const messages = response.data.messages || [];

        const fullMessages = await Promise.all(messages.map(async (msg) => {
            const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
            const headers = detail.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
            return { id: msg.id, subject, from, snippet: detail.data.snippet };
        }));

        return fullMessages;
    }

    static async getRecentFiles(userId) {
        const auth = await this.getAuthenticatedClient(userId);
        const drive = google.drive({ version: 'v3', auth });
        
        const response = await drive.files.list({
            pageSize: 5,
            fields: 'files(id, name, mimeType, webViewLink, iconLink)',
            orderBy: 'modifiedTime desc'
        });
        
        return response.data.files;
    }

    // --- CALENDAR METHODS ---

    static async getUpcomingMeetings(userId) {
        const auth = await this.getAuthenticatedClient(userId);
        const calendar = google.calendar({ version: 'v3', auth });
        
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 5,
            singleEvents: true,
            orderBy: 'startTime',
        });
        
        return response.data.items || [];
    }

// FIX: Enhanced Meeting Creation to ensure Google Meet Link generation
    static async createMeeting(userId, { summary, description, startTime, endTime }) {
        const auth = await this.getAuthenticatedClient(userId);
        const calendar = google.calendar({ version: 'v3', auth });

        const event = {
            summary,
            description,
            start: { dateTime: new Date(startTime).toISOString() },
            end: { dateTime: new Date(endTime).toISOString() },
            // This chunk tells Google "Please make a video call"
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
            conferenceDataVersion: 1 // REQUIRED for Meet Links to work
        });

        return response.data;
    }

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
        const message = messageParts.join('\n');
        const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw: encodedMessage }
        });

        return { success: true };
    }
}

module.exports = GoogleService;
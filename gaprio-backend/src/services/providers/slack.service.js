const { WebClient } = require('@slack/web-api');
const axios = require('axios');
const ConnectionModel = require('../../models/connection.model');

class SlackService {

    // 1. Auth URL
    static getAuthURL(userId = null) {
        const scopes = ['channels:read', 'groups:read', 'chat:write', 'users:read'];
        const userScopes = ['openid', 'email', 'profile'];

        const url = new URL('https://slack.com/oauth/v2/authorize');
        url.searchParams.append('client_id', process.env.SLACK_CLIENT_ID);
        url.searchParams.append('scope', scopes.join(','));
        url.searchParams.append('user_scope', userScopes.join(','));
        url.searchParams.append('redirect_uri', process.env.SLACK_REDIRECT_URI);
        
        if (userId) {
            url.searchParams.append('state', userId);
        }
        
        return url.toString();
    }

    // 2. Exchange Code for Token
    static async getTokens(code) {
        const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
            params: {
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.SLACK_REDIRECT_URI
            }
        });

        if (!response.data.ok) {
            console.error("Slack Token Error:", response.data);
            throw new Error(`Slack Auth Failed: ${response.data.error}`);
        }

        return response.data;
    }

    // 3. Refresh Token Helper (New)
    static async refreshAccessToken(refreshToken) {
        try {
            const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
                params: {
                    client_id: process.env.SLACK_CLIENT_ID,
                    client_secret: process.env.SLACK_CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                }
            });

            if (!response.data.ok) throw new Error(response.data.error);
            return response.data;
        } catch (error) {
            console.error('Slack Refresh Error:', error.message);
            throw error;
        }
    }

    // 4. Get Client (With Auto-Refresh)
    static async getClient(userId) {
        const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'slack');
        if (!connection) throw new Error('Slack not connected');
        
        // Only try to refresh if we actually HAVE a refresh token and an expiry date
        // (If Token Rotation is OFF, expires_at will be null, so this block is skipped)
        if (connection.refresh_token && connection.expires_at && new Date() > new Date(connection.expires_at)) {
            console.log("🔄 Refreshing Slack Token...");
            try {
                const data = await this.refreshAccessToken(connection.refresh_token);
                
                // Calculate new expiry (usually 12 hours for Slack if rotation is on)
                const newExpiresAt = new Date(Date.now() + (data.expires_in * 1000));
                
                await ConnectionModel.updateTokens(
                    userId, 
                    'slack', 
                    data.access_token, 
                    data.refresh_token, 
                    newExpiresAt
                );
                
                return new WebClient(data.access_token);
            } catch (error) {
                console.error("Slack refresh failed:", error.message);
                // Fallback to existing token if refresh fails (it might still be valid if rotation settings changed)
            }
        }
        
        return new WebClient(connection.access_token);
    }

    // --- FEATURE: Get Channels ---
    static async getChannels(userId) {
        try {
            const client = await this.getClient(userId);
            const result = await client.conversations.list({
                limit: 10,
                types: 'public_channel,private_channel',
                exclude_archived: true
            });
            
            return result.channels.map(c => ({
                id: c.id,
                name: c.name,
                topic: c.topic?.value || 'No topic',
                members_count: c.num_members
            }));
        } catch (error) {
            console.error("Slack API Error:", error.data?.error || error.message);
            return [];
        }
    }

    // --- FEATURE: Send Message ---
    static async sendMessage(userId, { channelId, text }) {
        try {
            const client = await this.getClient(userId);
            await client.chat.postMessage({
                channel: channelId,
                text: text
            });
            return { success: true };
        } catch (error) {
            throw new Error(`Failed to send Slack message: ${error.data?.error || error.message}`);
        }
    }
}

module.exports = SlackService;
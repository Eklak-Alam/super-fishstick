const { WebClient } = require('@slack/web-api');
const axios = require('axios');
const ConnectionModel = require('../../models/connection.model');

class SlackService {

    // ==========================================
    // 1. AUTH CONFIGURATION
    // ==========================================
    static getAuthURL(userId = null) {
        const scopes = [
            'app_mentions:read', 'calls:read', 'canvases:read', 'channels:history',
            'channels:join', 'channels:read', 'channels:manage', 'chat:write', 'chat:write.public',
            'emoji:read', 'files:read', 'files:write', 'groups:read', 'groups:write', 'im:read', 'im:write',
            'links:read', 'metadata.message:read', 'mpim:read', 'mpim:write', 'pins:read',
            'reactions:read', 'reactions:write', 'team:read', 'usergroups:read',
            'users.profile:read', 'users:read', 'users:write'
        ];
        
        const userScopes = ['openid', 'email', 'profile'];
        const url = new URL('https://slack.com/oauth/v2/authorize');
        url.searchParams.append('client_id', process.env.SLACK_CLIENT_ID);
        url.searchParams.append('scope', scopes.join(','));
        url.searchParams.append('user_scope', userScopes.join(','));
        url.searchParams.append('redirect_uri', process.env.SLACK_REDIRECT_URI);
        if (userId) url.searchParams.append('state', userId);
        
        return url.toString();
    }

    static async getTokens(code) {
        const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
            params: {
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.SLACK_REDIRECT_URI
            }
        });
        if (!response.data.ok) throw new Error(`Slack Auth Failed: ${response.data.error}`);
        return response.data;
    }

    // ==========================================
    // 2. AUTO-REFRESH & CLIENT BUILDER
    // ==========================================
    static async refreshAccessToken(refreshToken) {
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
    }

    static async getClient(userId) {
        const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'slack');
        if (!connection) throw new Error('Slack not connected');
        
        if (connection.refresh_token && connection.expires_at && new Date() > new Date(connection.expires_at)) {
            console.log(`🔄 Refreshing Slack Token for User ${userId}...`);
            try {
                const data = await this.refreshAccessToken(connection.refresh_token);
                const newExpiresAt = new Date(Date.now() + (data.expires_in * 1000));
                await ConnectionModel.updateTokens(userId, 'slack', data.access_token, data.refresh_token, newExpiresAt);
                return new WebClient(data.access_token);
            } catch (error) { console.error("Slack refresh failed:", error.message); }
        }
        return new WebClient(connection.access_token);
    }

    // ==========================================
    // 3. WORKSPACE DATA (READ CHANNELS + USERS)
    // ==========================================
    static async getWorkspaceData(userId) {
        try {
            const client = await this.getClient(userId);
            
            const [channelRes, userRes] = await Promise.all([
                client.conversations.list({ limit: 100, types: 'public_channel,private_channel,im,mpim', exclude_archived: true }),
                client.users.list({ limit: 150 })
            ]);

            const channels = channelRes.channels.map(c => ({
                id: c.id,
                name: c.name || 'Direct Message',
                is_private: c.is_private,
                is_im: c.is_im,
                topic: c.topic?.value || 'No topic',
                members_count: c.num_members || 2
            }));

            const users = userRes.members.filter(u => !u.deleted && !u.is_bot && u.id !== 'USLACKBOT').map(u => ({
                id: u.id,
                name: u.real_name || u.name,
                email: u.profile.email,
                image: u.profile.image_48
            }));

            return { channels, users };
        } catch (error) {
            console.error("Slack Workspace Data Error:", error.data?.error || error.message);
            return { channels: [], users: [] };
        }
    }

    // ==========================================
    // 4. CHAT ACTIONS (CRUD & AUTO-JOIN)
    // ==========================================

    static async getMessages(userId, channelId, limit = 30) {
        const client = await this.getClient(userId);
        let result;

        try {
            // Attempt to fetch history
            result = await client.conversations.history({ channel: channelId, limit });
        } catch (error) {
            // BULLETPROOFING: If bot is not in the channel, auto-join and retry
            if (error.data && error.data.error === 'not_in_channel') {
                console.log(`🤖 Bot auto-joining channel ${channelId}`);
                await client.conversations.join({ channel: channelId });
                result = await client.conversations.history({ channel: channelId, limit });
            } else {
                console.error("Slack API Error [getMessages]:", error.data?.error || error.message);
                throw error;
            }
        }
        
        const users = await this.getWorkspaceData(userId).then(d => d.users);
        
        return result.messages.map(msg => {
            const userObj = users.find(u => u.id === msg.user);
            return { 
                ...msg, 
                // Fallbacks for when a bot or webhook sends a message
                user_name: userObj ? userObj.name : (msg.username || 'System Bot'), 
                user_image: userObj ? userObj.image : (msg.icons?.image_48 || null) 
            };
        });
    }

    static async sendMessage(userId, { channelId, text }) {
        const client = await this.getClient(userId);
        try {
            const result = await client.chat.postMessage({ channel: channelId, text });
            return { success: true, ts: result.ts };
        } catch (error) {
            // BULLETPROOFING: If bot is not in the channel, auto-join and retry
            if (error.data && error.data.error === 'not_in_channel') {
                await client.conversations.join({ channel: channelId });
                const result = await client.chat.postMessage({ channel: channelId, text });
                return { success: true, ts: result.ts };
            }
            console.error("Slack API Error [sendMessage]:", error.data?.error || error.message);
            throw error;
        }
    }

    static async updateMessage(userId, { channelId, ts, newText }) {
        const client = await this.getClient(userId);
        try {
            const result = await client.chat.update({ channel: channelId, ts, text: newText });
            return { success: true, ts: result.ts };
        } catch (error) {
            console.error("Slack API Error [updateMessage]:", error.data?.error || error.message);
            throw error;
        }
    }

    static async deleteMessage(userId, { channelId, ts }) {
        const client = await this.getClient(userId);
        try {
            await client.chat.delete({ channel: channelId, ts });
            return { success: true };
        } catch (error) {
            console.error("Slack API Error [deleteMessage]:", error.data?.error || error.message);
            throw error;
        }
    }

    // ==========================================
    // 5. CHANNEL CREATION & DMs
    // ==========================================

    static async createChannel(userId, { name, isPrivate, description }) {
        const client = await this.getClient(userId);
        try {
            const result = await client.conversations.create({ name, is_private: isPrivate });
            if (description && result.channel.id) {
                await client.conversations.setTopic({ channel: result.channel.id, topic: description });
            }
            return result.channel;
        } catch (error) {
            console.error("Slack API Error [createChannel]:", error.data?.error || error.message);
            throw error;
        }
    }

    // Replace your current openDM with this safer version in backend
    static async openDM(userId, targetUserId) {
        if (!targetUserId) throw new Error("Target User ID is missing.");
        
        const client = await this.getClient(userId);
        try {
            // This is the Slack API call that was failing
            const result = await client.conversations.open({ users: targetUserId });
            return result.channel.id;
        } catch (error) {
            console.error("🔥 Slack API Error [openDM]:", error.data?.error || error.message);
            // We throw a clean error so Express catches it instead of crashing the server process
            throw new Error(error.data?.error || 'Failed to open Direct Message'); 
        }
    }
}

module.exports = SlackService;
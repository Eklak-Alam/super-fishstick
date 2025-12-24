// src/services/providers/slack.service.js
const { WebClient } = require('@slack/web-api');
const axios = require('axios');
const ConnectionModel = require('../../models/connection.model');

class SlackService {

    // 👇 UPDATE THIS METHOD
    static getAuthURL(userId = null) {
        const scopes = ['channels:read', 'groups:read', 'chat:write', 'users:read'];
        const userScopes = ['openid', 'email', 'profile'];

        const url = new URL('https://slack.com/oauth/v2/authorize');
        url.searchParams.append('client_id', process.env.SLACK_CLIENT_ID);
        url.searchParams.append('scope', scopes.join(','));
        url.searchParams.append('user_scope', userScopes.join(','));
        url.searchParams.append('redirect_uri', process.env.SLACK_REDIRECT_URI);
        
        if (userId) {
            url.searchParams.append('state', userId); // 👈 PASS USER ID HERE
        }
        
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

        if (!response.data.ok) {
            console.error("Slack Token Error:", response.data);
            throw new Error(`Slack Auth Failed: ${response.data.error}`);
        }

        return response.data;
    }

    static async getClient(userId) {
        const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'slack');
        if (!connection) throw new Error('Slack not connected');
        
        // Use the stored Access Token
        return new WebClient(connection.access_token);
    }

    // --- FEATURE: Get Channels ---
    static async getChannels(userId) {
        const client = await this.getClient(userId);
        
        try {
            const result = await client.conversations.list({
                limit: 10,
                types: 'public_channel,private_channel',
                exclude_archived: true
            });
            
            // Format for frontend
            return result.channels.map(c => ({
                id: c.id,
                name: c.name,
                topic: c.topic?.value || 'No topic',
                members_count: c.num_members
            }));
        } catch (error) {
            console.error("Slack API Error (Channels):", error.data?.error || error.message);
            return []; // Return empty array instead of crashing
        }
    }

    // --- FEATURE: Send Message ---
    static async sendMessage(userId, { channelId, text }) {
        const client = await this.getClient(userId);
        
        try {
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
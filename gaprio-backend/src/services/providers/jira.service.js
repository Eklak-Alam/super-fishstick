const axios = require('axios');
const ConnectionModel = require('../../models/connection.model');

class JiraService {
    static getAuthURL(userId = null) {
        const baseUrl = 'https://auth.atlassian.com/authorize';
        const params = new URLSearchParams({
            audience: 'api.atlassian.com',
            client_id: process.env.JIRA_CLIENT_ID,
            scope: 'read:jira-work manage:jira-project read:jira-user write:jira-work read:me read:account offline_access', // Added offline_access for refresh tokens
            redirect_uri: process.env.JIRA_REDIRECT_URI,
            state: userId, // Pass userId for linking
            response_type: 'code',
            prompt: 'consent'
        });
        return `${baseUrl}?${params.toString()}`;
    }

    static async getTokens(code) {
        try {
            const response = await axios.post('https://auth.atlassian.com/oauth/token', {
                grant_type: 'authorization_code',
                client_id: process.env.JIRA_CLIENT_ID,
                client_secret: process.env.JIRA_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.JIRA_REDIRECT_URI,
            });
            return response.data;
        } catch (error) {
            throw new Error(`Jira Token Error: ${error.response?.data?.error_description || error.message}`);
        }
    }

    static async getUserInfo(accessToken) {
        try {
            // Get generic Atlassian profile
            const response = await axios.get('https://api.atlassian.com/me', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data; 
        } catch (error) {
            throw new Error('Failed to fetch Jira user info');
        }
    }

    // --- JIRA SPECIFIC: Get the "Cloud ID" (Site ID) ---
    // Atlassian tokens work for multiple sites. We need to find which one to use.
    static async getCloudId(accessToken) {
        const response = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        // Return the first available site (Standard behavior)
        if (response.data.length > 0) {
            return response.data[0]; // Returns object { id, name, url }
        }
        throw new Error('No Jira resources found for this user');
    }

    static async refreshAccessToken(refreshToken) {
        try {
            const response = await axios.post('https://auth.atlassian.com/oauth/token', {
                grant_type: 'refresh_token',
                client_id: process.env.JIRA_CLIENT_ID,
                client_secret: process.env.JIRA_CLIENT_SECRET,
                refresh_token: refreshToken
            });
            return response.data;
        } catch (error) {
            console.error('Jira Refresh Error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getIssues(userId) {
        try {
            const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'jira');
            if (!connection) throw new Error('Jira not connected');

            const cloudId = connection.metadata?.cloudId;
            if (!cloudId) throw new Error('Jira Cloud ID missing');

            let accessToken = connection.access_token;

            // Check expiry
            const isExpired = Date.now() >= (new Date(connection.expires_at).getTime() - 5 * 60 * 1000);

            if (isExpired && connection.refresh_token) {
                console.log("🔄 Refreshing Jira Access Token...");
                try {
                    const tokenData = await this.refreshAccessToken(connection.refresh_token);
                    accessToken = tokenData.access_token;
                    const newExpiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

                    await ConnectionModel.updateTokens(
                        userId,
                        'jira',
                        accessToken,
                        tokenData.refresh_token, // Jira rotates refresh tokens!
                        newExpiresAt
                    );
                } catch (error) {
                    throw new Error('Jira session expired. Please reconnect.');
                }
            }

            const jql = 'assignee = currentUser() ORDER BY updated DESC';
            const response = await axios.get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { jql, maxResults: 10, fields: 'summary,status,priority,created' }
            });

            return response.data.issues.map(issue => ({
                id: issue.id,
                key: issue.key,
                summary: issue.fields.summary,
                status: issue.fields.status.name,
                priority: issue.fields.priority?.name || 'Medium',
                link: `${connection.metadata.url}/browse/${issue.key}`
            }));
        } catch (error) {
            console.error('Jira Issues Error:', error.response?.data || error.message);
            return [];
        }
    }
}

module.exports = JiraService;
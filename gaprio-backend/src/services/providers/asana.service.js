const axios = require('axios');
const ConnectionModel = require('../../models/connection.model');

class AsanaService {

    // 👇 UPDATE THIS METHOD
    static getAuthURL(userId = null) {
        const baseUrl = 'https://app.asana.com/-/oauth_authorize';
        const params = new URLSearchParams({
            client_id: process.env.ASANA_CLIENT_ID,
            redirect_uri: process.env.ASANA_REDIRECT_URI,
            response_type: 'code',
            scope: 'openid profile email projects:read tasks:read users:read workspaces:read',
        });

        if (userId) {
            params.append('state', userId); // 👈 PASS USER ID HERE
        }

        return `${baseUrl}?${params.toString()}`;
    }

    // 2. Exchange Code for Token
    static async getTokens(code) {
        try {
            const response = await axios.post(
                'https://app.asana.com/-/oauth_token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: process.env.ASANA_CLIENT_ID,
                    client_secret: process.env.ASANA_CLIENT_SECRET,
                    redirect_uri: process.env.ASANA_REDIRECT_URI,
                    code: code,
                })
            );
            return response.data;
        } catch (error) {
            console.error('Asana Token Error:', error.response?.data || error.message);
            throw new Error('Failed to retrieve Asana tokens');
        }
    }

    // 3. Get Authenticated User Info (For Login/Registration)
    static async getUserInfo(accessToken) {
        try {
            // Asana OIDC UserInfo endpoint
            const response = await axios.get('https://app.asana.com/-/oauth_userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data; 
        } catch (error) {
            console.error('Asana User Info Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch Asana user info');
        }
    }

    // 4. Helper: Get Authenticated Headers
    static async getHeaders(userId) {
        const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'asana');
        if (!connection) throw new Error('Asana not connected');
        return { Authorization: `Bearer ${connection.access_token}` };
    }

    // --- DATA FETCHING METHODS ---

    // Get Projects
    static async getProjects(userId) {
        try {
            const headers = await this.getHeaders(userId);
            // Fetch recent projects
            const response = await axios.get('https://app.asana.com/api/1.0/projects?limit=10&opt_fields=name,color,archived', { headers });
            return response.data.data;
        } catch (error) {
            console.error('Asana Projects Error:', error.response?.data || error.message);
            return [];
        }
    }

    // Get Tasks (My Tasks)
    static async getTasks(userId) {
        try {
            const headers = await this.getHeaders(userId);
            // First we need the user's "gid" (Asana ID)
            const userMe = await axios.get('https://app.asana.com/api/1.0/users/me', { headers });
            const userGid = userMe.data.data.gid;

            // Fetch tasks assigned to user
            const response = await axios.get(
                `https://app.asana.com/api/1.0/tasks?assignee=${userGid}&workspace=${userMe.data.data.workspaces[0].gid}&completed_since=now&limit=10&opt_fields=name,due_on,completed`, 
                { headers }
            );
            return response.data.data;
        } catch (error) {
            console.error('Asana Tasks Error:', error.response?.data || error.message);
            return [];
        }
    }
}

module.exports = AsanaService;
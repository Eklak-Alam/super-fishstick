const axios = require('axios');
const ConnectionModel = require('../../models/connection.model');

class AsanaService {

    // ==========================================
    // 1. AUTH CONFIGURATION
    // ==========================================
    static getAuthURL(userId = null) {
        const baseUrl = 'https://app.asana.com/-/oauth_authorize';
        
        // 🚨 The Ultimate "God Mode" Asana Scopes
        const scopes = [
            'openid', 'profile', 'email', 
            'attachments:read', 'attachments:write', 'attachments:delete',
            'custom_fields:read', 'custom_fields:write',
            'goals:read', 'jobs:read', 
            'portfolios:read', 'portfolios:write', 
            'project_templates:read', 
            'projects:read', 'projects:write', 'projects:delete',
            'roles:read', 'roles:write', 'roles:delete',
            'stories:read', 'stories:write', 
            'tags:read', 'tags:write', 
            'task_custom_types:read', 'task_templates:read', 
            'tasks:read', 'tasks:write', 'tasks:delete',
            'team_memberships:read', 'teams:read', 
            'time_tracking_entries:read', 
            'timesheet_approval_statuses:read', 'timesheet_approval_statuses:write',
            'users:read', 
            'webhooks:read', 'webhooks:write', 'webhooks:delete',
            'workspaces:read', 'workspaces.typeahead:read'
        ];

        const params = new URLSearchParams({
            client_id: process.env.ASANA_CLIENT_ID,
            redirect_uri: process.env.ASANA_REDIRECT_URI,
            response_type: 'code',
            scope: scopes.join(' '), // Asana requires space-separated scopes
        });

        if (userId) params.append('state', userId);
        return `${baseUrl}?${params.toString()}`;
    }

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
            console.error('🔥 Asana Token Error:', error.response?.data || error.message);
            throw new Error('Failed to retrieve Asana tokens');
        }
    }

    static async getUserInfo(accessToken) {
        try {
            const response = await axios.get('https://app.asana.com/api/1.0/users/me', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userData = response.data.data;
            return {
                id: userData.gid, 
                email: userData.email,
                name: userData.name
            };
        } catch (error) {
            console.error('🔥 Asana User Info Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch Asana user identity');
        }
    }

    // ==========================================
    // 2. AUTO-REFRESH & SECURITY HEADERS
    // ==========================================
    static async refreshAccessToken(refreshToken) {
        try {
            const response = await axios.post('https://app.asana.com/-/oauth_token', {
                grant_type: 'refresh_token',
                client_id: process.env.ASANA_CLIENT_ID,
                client_secret: process.env.ASANA_CLIENT_SECRET,
                refresh_token: refreshToken
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return response.data;
        } catch (error) {
            console.error('🔥 Asana Refresh Error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getHeaders(userId) {
        const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'asana');
        if (!connection) throw new Error('Asana API disconnected. Reconnect required.');

        // Refresh if within 5 minutes of expiration
        const isExpired = Date.now() >= (new Date(connection.expires_at).getTime() - 5 * 60 * 1000);

        if (isExpired && connection.refresh_token) {
            console.log("🔄 Auto-refreshing Asana Access Token...");
            try {
                const tokenData = await this.refreshAccessToken(connection.refresh_token);
                const newExpiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

                await ConnectionModel.updateTokens(
                    userId, 'asana', tokenData.access_token, 
                    tokenData.refresh_token || connection.refresh_token, 
                    newExpiresAt
                );
                return { Authorization: `Bearer ${tokenData.access_token}` };
            } catch (error) {
                throw new Error('Asana session severely expired. Please re-authenticate.');
            }
        }
        return { Authorization: `Bearer ${connection.access_token}` };
    }

    // ==========================================
    // 3. WORKSPACE OPTIMIZATION ENGINE
    // ==========================================
    static async getContextIds(headers) {
        try {
            // Fetches user ID and their workspaces in a single, high-efficiency call
            const userMe = await axios.get('https://app.asana.com/api/1.0/users/me?opt_fields=workspaces,gid', { headers });
            const userGid = userMe.data.data.gid;
            const workspaceGid = userMe.data.data.workspaces[0]?.gid; // Grabs primary workspace
            
            if (!workspaceGid) throw new Error('No Asana workspace found for this user.');
            return { userGid, workspaceGid };
        } catch (error) {
            console.error('🔥 Asana Context Error:', error.response?.data || error.message);
            throw new Error('Failed to resolve workspace telemetry.');
        }
    }

    // ==========================================
    // 4. PROJECTS (READ)
    // ==========================================
    static async getProjects(userId) {
        try {
            const headers = await this.getHeaders(userId);
            const { workspaceGid } = await this.getContextIds(headers);

            const response = await axios.get('https://app.asana.com/api/1.0/projects', { 
                headers,
                params: {
                    workspace: workspaceGid,
                    limit: 50, // Increased limit for enterprise-scale
                    opt_fields: 'name,color,archived,permalink_url', // Added permalink
                    archived: false
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('🔥 Asana Projects Error:', error.response?.data?.errors || error.message);
            throw new Error('Failed to fetch projects');
        }
    }

    // ==========================================
    // 5. TASKS ENGINE (100% CRUD)
    // ==========================================

    // READ Tasks
    static async getTasks(userId) {
        try {
            const headers = await this.getHeaders(userId);
            const { userGid, workspaceGid } = await this.getContextIds(headers);

            const response = await axios.get(`https://app.asana.com/api/1.0/tasks`, { 
                headers,
                params: {
                    assignee: userGid,
                    workspace: workspaceGid,
                    completed_since: 'now', // Only fetches incomplete/pending tasks
                    limit: 50,
                    opt_fields: 'name,due_on,completed,projects.name,notes,permalink_url' // Vital metadata
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('🔥 Asana Tasks Error:', error.response?.data?.errors || error.message);
            throw new Error('Failed to read tasks');
        }
    }

    // CREATE Task
    static async createTask(userId, { name, notes, date, projectGid }) {
        try {
            const headers = await this.getHeaders(userId);
            const { userGid, workspaceGid } = await this.getContextIds(headers);
            
            // Dynamically build payload to prevent 'undefined' validation errors
            const taskData = {
                name,
                assignee: userGid,
                workspace: workspaceGid
            };
            if (notes) taskData.notes = notes;
            if (date) taskData.due_on = date;
            if (projectGid) taskData.projects = [projectGid];

            const response = await axios.post('https://app.asana.com/api/1.0/tasks', { data: taskData }, { headers });
            return response.data.data;
        } catch (error) {
            console.error('🔥 Asana Task Creation Error:', error.response?.data?.errors || error.message);
            throw new Error(error.response?.data?.errors[0]?.message || 'Failed to initialize task.');
        }
    }

    // UPDATE Task
    static async updateTask(userId, taskId, { name, notes, date }) {
        try {
            const headers = await this.getHeaders(userId);
            
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (notes !== undefined) updateData.notes = notes;
            if (date !== undefined) updateData.due_on = date;

            const response = await axios.put(`https://app.asana.com/api/1.0/tasks/${taskId}`, { data: updateData }, { headers });
            return response.data.data;
        } catch (error) {
            console.error('🔥 Asana Task Update Error:', error.response?.data?.errors || error.message);
            throw new Error('Failed to update task telemetry.');
        }
    }

    // COMPLETE Task
    static async completeTask(userId, taskId) {
        try {
            const headers = await this.getHeaders(userId);
            await axios.put(`https://app.asana.com/api/1.0/tasks/${taskId}`, {
                data: { completed: true }
            }, { headers });
            return { success: true, message: 'Task marked complete' };
        } catch (error) {
            console.error('🔥 Asana Task Complete Error:', error.response?.data?.errors || error.message);
            throw new Error('Failed to mark task as completed.');
        }
    }

    // DELETE Task
    static async deleteTask(userId, taskId) {
        try {
            const headers = await this.getHeaders(userId);
            await axios.delete(`https://app.asana.com/api/1.0/tasks/${taskId}`, { headers });
            return { success: true, message: 'Task deleted permanently' };
        } catch (error) {
            console.error('🔥 Asana Task Delete Error:', error.response?.data?.errors || error.message);
            throw new Error('Failed to permanently delete task.');
        }
    }

    // CREATE Project
    static async createProject(userId, { name, color }) {
        try {
            const headers = await this.getHeaders(userId);
            const { workspaceGid } = await this.getContextIds(headers);

            const response = await axios.post('https://app.asana.com/api/1.0/projects', { 
                data: {
                    name,
                    color: color || 'dark-pink',
                    workspace: workspaceGid
                } 
            }, { headers });
            return response.data.data;
        } catch (error) {
            console.error('🔥 Asana Project Creation Error:', error.response?.data?.errors || error.message);
            throw new Error('Failed to initialize project.');
        }
    }

    // DELETE Project
    static async deleteProject(userId, projectId) {
        try {
            const headers = await this.getHeaders(userId);
            await axios.delete(`https://app.asana.com/api/1.0/projects/${projectId}`, { headers });
            return { success: true, message: 'Project eradicated.' };
        } catch (error) {
            console.error('🔥 Asana Project Delete Error:', error.response?.data?.errors || error.message);
            throw new Error('Failed to permanently delete project.');
        }
    }
}

module.exports = AsanaService;
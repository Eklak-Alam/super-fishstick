const axios = require('axios');
const ConnectionModel = require('../../models/connection.model');

class ZohoService {
    
    // --- 1. Generate Login URL ---
    static getAuthURL(userId = null) {
        // We use the global .com link; Zoho automatically redirects based on user's location
        const baseUrl = 'https://accounts.zoho.com/oauth/v2/auth';
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.ZOHO_CLIENT_ID,
            redirect_uri: process.env.ZOHO_REDIRECT_URI,
            access_type: 'offline', // CRITICAL: This ensures we get a Refresh Token
            prompt: 'consent',
            
            // 👇 HERE ARE YOUR SCOPES
            scope: 'ZohoCRM.modules.deals.READ,ZohoCRM.users.READ,aaaserver.profile.READ'
        });

        if (userId) params.append('state', userId);

        return `${baseUrl}?${params.toString()}`;
    }

    // --- 2. Exchange Code for Tokens ---
    static async getTokens(code) {
        try {
            const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    redirect_uri: process.env.ZOHO_REDIRECT_URI,
                    code: code,
                }
            });
            // This response contains 'api_domain' (e.g., https://www.zohoapis.eu)
            // We MUST return this so we can save it to the DB
            return response.data; 
        } catch (error) {
            throw new Error(`Zoho Token Error: ${error.response?.data?.error || error.message}`);
        }
    }

    // --- 3. Get User Profile ---
    static async getUserInfo(accessToken, apiDomain) {
        try {
            // We use the apiDomain we just got (e.g. .eu, .in, .com) to call the right server
            const response = await axios.get(`${apiDomain}/crm/v3/users?type=CurrentUser`, {
                headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
            });
            const user = response.data.users[0];
            return {
                id: user.id,
                email: user.email,
                name: user.full_name
            };
        } catch (error) {
            throw new Error('Failed to fetch Zoho user info');
        }
    }

    // New Helper: Refresh Token
    static async refreshAccessToken(refreshToken) {
        try {
            const response = await axios.post(process.env.ZOHO_TOKEN_URL || 'https://accounts.zoho.com/oauth/v2/token', null, {
                params: {
                    grant_type: 'refresh_token',
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    refresh_token: refreshToken
                }
            });
            return response.data;
        } catch (error) {
            console.error('Zoho Refresh Error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getDeals(userId) {
        try {
            const connection = await ConnectionModel.findByUserIdAndProvider(userId, 'zoho');
            if (!connection) throw new Error('Zoho not connected');

            let accessToken = connection.access_token;
            const apiDomain = connection.metadata.apiDomain || 'https://www.zohoapis.com';

            // Check expiry
            const isExpired = Date.now() >= (new Date(connection.expires_at).getTime() - 5 * 60 * 1000);

            if (isExpired && connection.refresh_token) {
                console.log("🔄 Refreshing Zoho Access Token...");
                try {
                    const tokenData = await this.refreshAccessToken(connection.refresh_token);
                    
                    if (tokenData.error) throw new Error(tokenData.error);

                    accessToken = tokenData.access_token;
                    // Zoho usually returns expires_in (seconds)
                    const newExpiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

                    await ConnectionModel.updateTokens(
                        userId,
                        'zoho',
                        accessToken,
                        null, // Zoho refresh tokens are permanent usually, unless revoked
                        newExpiresAt
                    );
                } catch (error) {
                    console.error("Zoho Refresh Failed", error);
                    throw new Error('Zoho session expired. Please reconnect.');
                }
            }

            const response = await axios.get(`${apiDomain}/crm/v3/Deals`, {
                headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
                params: { 
                    sort_order: 'desc', 
                    sort_by: 'Created_Time', 
                    per_page: 5, 
                    fields: 'Deal_Name,Amount,Stage,Closing_Date' 
                }
            });

            if (!response.data.data) return [];

            return response.data.data.map(deal => ({
                id: deal.id,
                name: deal.Deal_Name,
                amount: deal.Amount ? `$${deal.Amount.toLocaleString()}` : 'N/A',
                stage: deal.Stage,
                date: deal.Closing_Date
            }));

        } catch (error) {
            console.error('Zoho Deals Error:', error.response?.data || error.message);
            return [];
        }
    }
}

module.exports = ZohoService;
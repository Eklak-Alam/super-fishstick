const db = require('../config/db');

class ConnectionModel {
    // Save or Update a Connection (Google, Slack, etc.)
    static async upsert({ userId, provider, providerUserId, accessToken, refreshToken, expiresAt, metadata }) {
        const sql = `
            INSERT INTO user_connections 
            (user_id, provider, provider_user_id, access_token, refresh_token, expires_at, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            access_token = VALUES(access_token),
            refresh_token = VALUES(refresh_token),
            expires_at = VALUES(expires_at),
            metadata = VALUES(metadata),
            updated_at = NOW()
        `;
        
        const [result] = await db.execute(sql, [
            userId, 
            provider, 
            providerUserId, 
            accessToken, 
            refreshToken, 
            expiresAt, 
            JSON.stringify(metadata)
        ]);
        
        return result;
    }

    // Find a connection by provider ID (e.g., find user by Google ID)
    static async findByProviderId(provider, providerUserId) {
        const sql = `SELECT * FROM user_connections WHERE provider = ? AND provider_user_id = ?`;
        const [rows] = await db.execute(sql, [provider, providerUserId]);
        return rows[0];
    }

    // New: Find by User ID
    static async findByUserIdAndProvider(userId, provider) {
        const sql = `SELECT * FROM user_connections WHERE user_id = ? AND provider = ?`;
        const [rows] = await db.execute(sql, [userId, provider]);
        return rows[0];
    }

    // New: Update Tokens (Used during refresh)
    static async updateTokens(userId, provider, accessToken, refreshToken, expiresAt) {
        // Only update refresh_token if a new one was provided (sometimes Google doesn't send it back)
        let sql, params;
        if (refreshToken) {
            sql = `UPDATE user_connections SET access_token = ?, refresh_token = ?, expires_at = ? WHERE user_id = ? AND provider = ?`;
            params = [accessToken, refreshToken, expiresAt, userId, provider];
        } else {
            sql = `UPDATE user_connections SET access_token = ?, expires_at = ? WHERE user_id = ? AND provider = ?`;
            params = [accessToken, expiresAt, userId, provider];
        }
        await db.execute(sql, params);
    }
}

module.exports = ConnectionModel;
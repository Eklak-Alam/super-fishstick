const db = require('../config/db');

class ConnectionModel {
    // 1. Smart Upsert: Only update refresh_token if we got a new one
    static async upsert({ userId, provider, providerUserId, accessToken, refreshToken, expiresAt, metadata }) {
        
        let updateFields = [
            "access_token = VALUES(access_token)",
            "updated_at = NOW()"
        ];

        // Dynamically add fields only if they exist so we don't overwrite good data with nulls
        if (expiresAt) updateFields.push("expires_at = VALUES(expires_at)");
        if (refreshToken) updateFields.push("refresh_token = VALUES(refresh_token)");
        if (metadata) updateFields.push("metadata = VALUES(metadata)");

        const sql = `
            INSERT INTO user_connections 
            (user_id, provider, provider_user_id, access_token, refresh_token, expires_at, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            ${updateFields.join(', ')}
        `;
        
        // 👇 THE FIX: Force every single parameter to be either the real value or standard SQL 'null'. 
        // This completely eliminates the 'undefined' crash.
        const [result] = await db.execute(sql, [
            userId || null, 
            provider || null, 
            providerUserId || null, 
            accessToken || null, 
            refreshToken || null, 
            expiresAt || null, 
            metadata ? JSON.stringify(metadata) : null
        ]);
        
        return result;
    }

    // Find connection by Provider ID (e.g., Google ID)
    static async findByProviderId(provider, providerUserId) {
        const sql = `SELECT * FROM user_connections WHERE provider = ? AND provider_user_id = ?`;
        const [rows] = await db.execute(sql, [provider, providerUserId]);
        return rows[0];
    }

    // Find by User ID
    static async findByUserIdAndProvider(userId, provider) {
        const sql = `SELECT * FROM user_connections WHERE user_id = ? AND provider = ?`;
        const [rows] = await db.execute(sql, [userId, provider]);
        return rows[0];
    }

    // Update Tokens (Used during refresh)
    static async updateTokens(userId, provider, accessToken, refreshToken, expiresAt) {
        let sql, params;
        
        if (refreshToken) {
            sql = `UPDATE user_connections SET access_token = ?, refresh_token = ?, expires_at = ?, updated_at = NOW() WHERE user_id = ? AND provider = ?`;
            params = [
                accessToken || null, 
                refreshToken || null, 
                expiresAt || null, 
                userId, 
                provider
            ];
        } else {
            sql = `UPDATE user_connections SET access_token = ?, expires_at = ?, updated_at = NOW() WHERE user_id = ? AND provider = ?`;
            params = [
                accessToken || null, 
                expiresAt || null, 
                userId, 
                provider
            ];
        }
        await db.execute(sql, params);
    }
}

module.exports = ConnectionModel;
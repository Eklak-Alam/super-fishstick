// src/database/init.db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true // Allows running all queries at once
};

const initSQL = `
    CREATE DATABASE IF NOT EXISTS gapriomanagement;
    USE gapriomanagement;

    -- 1. USERS TABLE (The Core Identity)
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- 2. REFRESH TOKENS (For keeping users logged in to Gaprio)
    CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(512) NOT NULL,
        user_id INT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. CONNECTIONS (For External Apps like Slack/Google)
    -- One user can have many rows:
    -- Row 1: User 5 | Provider: 'google' | Token: 'abc...'
    -- Row 2: User 5 | Provider: 'slack'  | Token: 'xyz...'
    CREATE TABLE IF NOT EXISTS user_connections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        provider VARCHAR(50) NOT NULL,
        provider_user_id VARCHAR(255),
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at DATETIME,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_provider (user_id, provider)
    );
`;

async function initializeDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("🔄 Initializing Database...");
        await connection.query(initSQL);
        console.log("✅ Database 'gapriomanagement' and tables created successfully!");
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error initializing DB:", error);
        process.exit(1);
    }
}

initializeDB();
// src/models/user.model.js
const db = require('../config/db');

class UserModel {
    static async create({ fullName, email, passwordHash }) {
        const sql = `INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)`;
        const [result] = await db.execute(sql, [fullName, email, passwordHash]);
        return result.insertId;
    }

    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }

    // New: Find user by ID (excludes password for safety)
    static async findById(id) {
        const sql = `SELECT id, full_name, email, created_at, updated_at FROM users WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    // New: Find user by ID but INCLUDE password (for password changes)
    static async findByIdWithPassword(id) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    // New: Update basic info
    static async update(id, { fullName, email }) {
        const sql = `UPDATE users SET full_name = ?, email = ? WHERE id = ?`;
        const [result] = await db.execute(sql, [fullName, email, id]);
        return result.affectedRows > 0;
    }

    // New: Update Password
    static async updatePassword(id, newPasswordHash) {
        const sql = `UPDATE users SET password_hash = ? WHERE id = ?`;
        const [result] = await db.execute(sql, [newPasswordHash, id]);
        return result.affectedRows > 0;
    }
}

module.exports = UserModel;
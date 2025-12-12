// src/services/auth.service.js
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const TokenService = require('./token.service');

class AuthService {

    // 1. Register
    static async register(fullName, email, password) {
        // Validation
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409; // Conflict
            throw error;
        }

        // Hashing
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creation
        const userId = await UserModel.create({ fullName, email, passwordHash: hashedPassword });
        
        return { id: userId, fullName, email };
    }

    // 2. Login 
    static async login(email, password) {
        const user = await UserModel.findByEmail(email);
        
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Generate Tokens
        const accessToken = TokenService.generateAccessToken(user);
        const refreshToken = await TokenService.generateRefreshToken(user.id);

        return { 
            user: { id: user.id, name: user.full_name, email: user.email },
            accessToken,
            refreshToken
        };
    }

    // 3. Refresh token
    static async refresh(refreshToken) {
        const tokenRecord = await TokenService.verifyRefreshToken(refreshToken);
        const user = await UserModel.findById(tokenRecord.user_id);

        if (!user) throw new Error('User not found');

        // Generate new Access Token
        const newAccessToken = TokenService.generateAccessToken(user);
        
        return { accessToken: newAccessToken };
    }

    // 4. Get Profile
    static async getProfile(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    // 5. Update Profile
    static async updateProfile(userId, updateData) {
        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Perform update
        await UserModel.update(userId, {
            fullName: updateData.fullName || user.full_name,
            email: updateData.email || user.email
        });

        // Return updated user
        return await UserModel.findById(userId);
    }

    // 6. Change Password
    static async changePassword(userId, oldPassword, newPassword) {
        // Get user WITH password hash
        const user = await UserModel.findByIdWithPassword(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Verify Old Password
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            const error = new Error('Incorrect old password');
            error.statusCode = 401;
            throw error;
        }

        // Hash New Password
        const salt = await bcrypt.genSalt(12);
        const newHash = await bcrypt.hash(newPassword, salt);

        // Update DB
        await UserModel.updatePassword(userId, newHash);

        return { message: 'Password updated successfully' };
    }
}

module.exports = AuthService;
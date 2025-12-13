const GoogleService = require('../services/providers/google.service');
const ConnectionModel = require('../models/connection.model');
const UserModel = require('../models/user.model');
const TokenService = require('../services/token.service');

// 1. Redirect user to Google
exports.googleAuth = (req, res) => {
    const url = GoogleService.getAuthURL();
    res.redirect(url);
};

// 2. Handle the return trip from Google
exports.googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) throw new Error('No code provided by Google');

        // A. Get Tokens (FIXED: Grab expiry_date directly)
        const tokens = await GoogleService.getTokens(code);
        const { access_token, refresh_token, expiry_date } = tokens;
        
        // B. Get User Info
        const googleUser = await GoogleService.getUserInfo(access_token);
        
        // C. Calculate Expiry (FIXED: Use the timestamp from Google directly)
        // If expiry_date exists, use it. Otherwise default to 1 hour from now.
        const expiresAt = expiry_date ? new Date(expiry_date) : new Date(Date.now() + 3600 * 1000);

        // --- LOGIN / REGISTER LOGIC ---
        
        // 1. Check if we already have this Google User linked
        let connection = await ConnectionModel.findByProviderId('google', googleUser.id);
        let userId;

        if (connection) {
            // User exists via Google -> Get their Gaprio ID
            userId = connection.user_id;
        } else {
            // 2. Check if email exists in 'users' table
            let user = await UserModel.findByEmail(googleUser.email);
            
            if (!user) {
                // 3. New User -> Create Gaprio Account
                const randomPassword = Math.random().toString(36).slice(-8); 
                const bcrypt = require('bcryptjs');
                const salt = await bcrypt.genSalt(12);
                const hashedPassword = await bcrypt.hash(randomPassword, salt);
                
                userId = await UserModel.create({
                    fullName: googleUser.name,
                    email: googleUser.email,
                    passwordHash: hashedPassword 
                });
            } else {
                userId = user.id;
            }
        }

        // 4. Save/Update the Google Connection in DB
        await ConnectionModel.upsert({
            userId,
            provider: 'google',
            providerUserId: googleUser.id,
            accessToken: access_token,
            refreshToken: refresh_token || null, // Important: Google only sends this the first time!
            expiresAt,
            metadata: { picture: googleUser.picture, email: googleUser.email }
        });

        // 5. Generate Gaprio Session Tokens
        const user = await UserModel.findById(userId);
        const accessToken = TokenService.generateAccessToken(user);
        const refreshToken = await TokenService.generateRefreshToken(user.id);

        // 6. Redirect to Frontend
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);

    } catch (error) {
        console.error("Google Callback Error:", error);
        res.redirect('http://localhost:3000/login?error=GoogleAuthFailed');
    }
};
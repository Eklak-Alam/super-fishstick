const GoogleService = require('../services/providers/google.service');
const SlackService = require('../services/providers/slack.service');
const ConnectionModel = require('../models/connection.model');
const UserModel = require('../models/user.model');
const TokenService = require('../services/token.service');
const { WebClient } = require('@slack/web-api'); // Needed to fetch user info before saving
const bcrypt = require('bcryptjs'); // Needed to generate random passwords

// ==========================================
// 🔵 HELPER: Handle Login / Registration Logic
// ==========================================
async function handleUserLogin(providerProfile, providerName) {
    // 1. Check if Connection exists (e.g., Slack ID linked?)
    let connection = await ConnectionModel.findByProviderId(providerName, providerProfile.id);
    let userId;

    if (connection) {
        // User is already linked -> Get their ID
        userId = connection.user_id;
    } else {
        // 2. Check if Email exists in Users table
        let user = await UserModel.findByEmail(providerProfile.email);
        
        if (!user) {
            // 3. User doesn't exist -> Create new account
            console.log(`Creating new user for ${providerProfile.email}`);
            const randomPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);
            
            userId = await UserModel.create({
                fullName: providerProfile.name,
                email: providerProfile.email,
                passwordHash: hashedPassword 
            });
        } else {
            // User exists via email -> Link them
            userId = user.id;
        }
    }
    return userId;
}

// ==========================================
// 🟢 GOOGLE AUTHENTICATION
// ==========================================

exports.googleAuth = (req, res) => {
    const url = GoogleService.getAuthURL();
    res.redirect(url);
};

exports.googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) throw new Error('No code provided by Google');

        // 1. Get Tokens
        const tokens = await GoogleService.getTokens(code);
        const { access_token, refresh_token, expiry_date } = tokens;
        
        // Robust Expiry Calculation
        const expiresAt = expiry_date 
            ? new Date(expiry_date) 
            : new Date(Date.now() + 3500 * 1000); 

        // 2. Get User Info from Google
        const googleUser = await GoogleService.getUserInfo(access_token);

        // 3. Handle User Creation / Lookup
        const userId = await handleUserLogin({
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name
        }, 'google');

        // 4. Save Connection (Upsert)
        await ConnectionModel.upsert({
            userId,
            provider: 'google',
            providerUserId: googleUser.id,
            accessToken: access_token,
            refreshToken: refresh_token || null, // Logic in model handles this being null
            expiresAt,
            metadata: { picture: googleUser.picture, email: googleUser.email }
        });

        // 5. Generate Session Tokens & Redirect
        const user = await UserModel.findById(userId);
        const accessTokenJWT = TokenService.generateAccessToken(user);
        const refreshTokenJWT = await TokenService.generateRefreshToken(user.id);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/callback?accessToken=${accessTokenJWT}&refreshToken=${refreshTokenJWT}`);

    } catch (error) {
        console.error("Google Callback Error:", error);
        res.redirect('http://localhost:3000/login?error=GoogleAuthFailed');
    }
};

// ==========================================
// 🟣 SLACK AUTHENTICATION
// ==========================================

exports.slackAuth = (req, res) => {
    const url = SlackService.getAuthURL();
    res.redirect(url);
};

exports.slackCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) throw new Error('No code provided by Slack');

        // 1. Get Tokens from Slack
        const data = await SlackService.getTokens(code);
        const accessToken = data.access_token;
        const slackUserId = data.authed_user.id;

        // 2. Get User Profile (to get Name & Email)
        // We need a temporary client here because we haven't saved the token yet
        const tempClient = new WebClient(accessToken);
        const userInfo = await tempClient.users.info({ user: slackUserId });
        
        if (!userInfo.ok) throw new Error("Failed to fetch Slack user info");
        const slackProfile = userInfo.user;

        // 3. Handle User Creation / Lookup
        const userId = await handleUserLogin({
            id: slackProfile.id,
            email: slackProfile.profile.email,
            name: slackProfile.real_name
        }, 'slack');

        // 4. Save Connection
        await ConnectionModel.upsert({
            userId,
            provider: 'slack',
            providerUserId: slackProfile.id,
            accessToken: accessToken,
            refreshToken: null, // Slack V2 tokens don't expire by default
            expiresAt: null, 
            metadata: { 
                teamName: data.team.name, 
                teamId: data.team.id 
            }
        });

        // 5. Generate Session & Redirect
        const user = await UserModel.findById(userId);
        const accessTokenJWT = TokenService.generateAccessToken(user);
        const refreshTokenJWT = await TokenService.generateRefreshToken(user.id);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/callback?accessToken=${accessTokenJWT}&refreshToken=${refreshTokenJWT}`);

    } catch (error) {
        console.error("Slack Callback Error:", error);
        res.redirect('http://localhost:3000/login?error=SlackAuthFailed');
    }
};
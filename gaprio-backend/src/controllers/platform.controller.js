const GoogleService = require('../services/providers/google.service');
const SlackService = require('../services/providers/slack.service');
const AsanaService = require('../services/providers/asana.service');
const ConnectionModel = require('../models/connection.model');
const UserModel = require('../models/user.model');
const TokenService = require('../services/token.service');
const { WebClient } = require('@slack/web-api');
const bcrypt = require('bcryptjs');

// ==========================================
// 🔵 HELPER: Identity Resolution Logic
// ==========================================
async function resolveUser(providerProfile, providerName, stateUserId) {
    
    // 1. LINKING MODE: If stateUserId exists, IT MEANS USER IS ALREADY LOGGED IN.
    // Force link to this ID. Do NOT create a new user.
    if (stateUserId && stateUserId !== 'null' && stateUserId !== 'undefined') {
        console.log(`🔗 Linking ${providerName} account (${providerProfile.email}) to existing User ID: ${stateUserId}`);
        return stateUserId;
    }

    // 2. LOGIN MODE: Check if this connection already exists
    let connection = await ConnectionModel.findByProviderId(providerName, providerProfile.id);
    if (connection) return connection.user_id;

    // 3. REGISTRATION MODE: Check if email exists in users table
    let user = await UserModel.findByEmail(providerProfile.email);
    if (!user) {
        // Create NEW user only if no link and no email match
        console.log(`🆕 Creating NEW user for ${providerProfile.email}`);
        const randomPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(randomPassword, salt);
        
        return await UserModel.create({
            fullName: providerProfile.name,
            email: providerProfile.email,
            passwordHash: hash
        });
    }
    
    return user.id;
}

// ==========================================
// 🟢 GOOGLE
// ==========================================
exports.googleAuth = (req, res) => {
    const { userId } = req.query; // Recieve from Frontend
    const url = GoogleService.getAuthURL(userId); // Pass as state
    res.redirect(url);
};

exports.googleCallback = async (req, res) => {
    try {
        const { code, state } = req.query; // 'state' is the userId
        const tokens = await GoogleService.getTokens(code);
        const googleUser = await GoogleService.getUserInfo(tokens.access_token);

        // Resolve User (Pass state)
        const userId = await resolveUser({
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name
        }, 'google', state);

        await ConnectionModel.upsert({
            userId,
            provider: 'google',
            providerUserId: googleUser.id,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || null,
            expiresAt: new Date(tokens.expiry_date || Date.now() + 3500 * 1000),
            metadata: { picture: googleUser.picture, email: googleUser.email }
        });

        const user = await UserModel.findById(userId);
        const access = TokenService.generateAccessToken(user);
        const refresh = await TokenService.generateRefreshToken(user.id);
        
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/callback?accessToken=${access}&refreshToken=${refresh}`);
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.redirect('http://localhost:3000/login?error=GoogleFailed');
    }
};

// ==========================================
// 🟣 SLACK
// ==========================================
exports.slackAuth = (req, res) => {
    const { userId } = req.query;
    const url = SlackService.getAuthURL(userId);
    res.redirect(url);
};

exports.slackCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        const data = await SlackService.getTokens(code);
        const tempClient = new WebClient(data.access_token);
        const userInfo = await tempClient.users.info({ user: data.authed_user.id });
        const slackProfile = userInfo.user;

        const userId = await resolveUser({
            id: slackProfile.id,
            email: slackProfile.profile.email,
            name: slackProfile.real_name
        }, 'slack', state);

        await ConnectionModel.upsert({
            userId,
            provider: 'slack',
            providerUserId: slackProfile.id,
            accessToken: data.access_token,
            refreshToken: null,
            expiresAt: null,
            metadata: { teamName: data.team.name, teamId: data.team.id }
        });

        const user = await UserModel.findById(userId);
        const access = TokenService.generateAccessToken(user);
        const refresh = await TokenService.generateRefreshToken(user.id);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/callback?accessToken=${access}&refreshToken=${refresh}`);
    } catch (error) {
        console.error("Slack Auth Error:", error);
        res.redirect('http://localhost:3000/login?error=SlackFailed');
    }
};

// ==========================================
// 🟠 ASANA
// ==========================================
exports.asanaAuth = (req, res) => {
    const { userId } = req.query;
    const url = AsanaService.getAuthURL(userId);
    res.redirect(url);
};

exports.asanaCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        const tokenData = await AsanaService.getTokens(code);
        const asanaUser = tokenData.data; 

        const userId = await resolveUser({
            id: asanaUser.gid || asanaUser.id,
            email: asanaUser.email,
            name: asanaUser.name
        }, 'asana', state);

        await ConnectionModel.upsert({
            userId,
            provider: 'asana',
            providerUserId: asanaUser.gid || asanaUser.id,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
            metadata: { name: asanaUser.name, email: asanaUser.email }
        });

        const user = await UserModel.findById(userId);
        const access = TokenService.generateAccessToken(user);
        const refresh = await TokenService.generateRefreshToken(user.id);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/callback?accessToken=${access}&refreshToken=${refresh}`);
    } catch (error) {
        console.error("Asana Auth Error:", error);
        res.redirect('http://localhost:3000/login?error=AsanaFailed');
    }
};
const GoogleService = require('../services/providers/google.service');
const SlackService = require('../services/providers/slack.service');
const AsanaService = require('../services/providers/asana.service');
const MiroService = require('../services/providers/miro.service');
const JiraService = require('../services/providers/jira.service');
const ZohoService = require('../services/providers/zoho.service');
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



// ==========================================
// 🎨 MIRO AUTH
// ==========================================
exports.miroAuth = (req, res) => {
    const { userId } = req.query;
    res.redirect(MiroService.getAuthURL(userId));
};

exports.miroCallback = async (req, res) => {
    try {
        const { code, state } = req.query; // state = userId
        const tokens = await MiroService.getTokens(code);
        const miroUser = await MiroService.getUserInfo(tokens.access_token);

        const userId = await resolveUser({
            id: miroUser.id,
            email: miroUser.email, 
            name: miroUser.name
        }, 'miro', state);

        await ConnectionModel.upsert({
            userId,
            provider: 'miro',
            providerUserId: miroUser.id,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt: new Date(Date.now() + (tokens.expires_in * 1000)), // expires_in is seconds
            metadata: { name: miroUser.name, email: miroUser.email }
        });

        // Redirect home
        const user = await UserModel.findById(userId);
        const access = TokenService.generateAccessToken(user);
        const refresh = await TokenService.generateRefreshToken(user.id);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/callback?accessToken=${access}&refreshToken=${refresh}`);
    } catch (error) {
        console.error("Miro Auth Error:", error);
        res.redirect('http://localhost:3000/login?error=MiroFailed');
    }
};

// ==========================================
// 🐞 JIRA AUTH
// ==========================================
exports.jiraAuth = (req, res) => {
    const { userId } = req.query;
    res.redirect(JiraService.getAuthURL(userId));
};

exports.jiraCallback = async (req, res) => {
    try {
        const { code, state } = req.query; // state = userId
        const tokens = await JiraService.getTokens(code);
        const jiraUser = await JiraService.getUserInfo(tokens.access_token);
        
        // CRITICAL: Fetch Cloud ID (Site ID) to make API calls later
        const siteResource = await JiraService.getCloudId(tokens.access_token);

        const userId = await resolveUser({
            id: jiraUser.account_id,
            email: jiraUser.email,
            name: jiraUser.name
        }, 'jira', state);

        await ConnectionModel.upsert({
            userId,
            provider: 'jira',
            providerUserId: jiraUser.account_id,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt: new Date(Date.now() + (tokens.expires_in * 1000)),
            // Store Cloud ID in metadata so we know which Jira site to query
            metadata: { 
                name: jiraUser.name, 
                email: jiraUser.email, 
                cloudId: siteResource.id, 
                url: siteResource.url 
            }
        });

        const user = await UserModel.findById(userId);
        const access = TokenService.generateAccessToken(user);
        const refresh = await TokenService.generateRefreshToken(user.id);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/callback?accessToken=${access}&refreshToken=${refresh}`);
    } catch (error) {
        console.error("Jira Auth Error:", error);
        res.redirect('http://localhost:3000/login?error=JiraFailed');
    }
};

// ==========================================
// 💼 ZOHO AUTH
// ==========================================
exports.zohoAuth = (req, res) => {
    const { userId } = req.query;
    res.redirect(ZohoService.getAuthURL(userId));
};

exports.zohoCallback = async (req, res) => {
    try {
        const { code, state } = req.query; // state = userId
        
        // 1. Get Tokens (includes api_domain!)
        const tokenData = await ZohoService.getTokens(code);
        const { access_token, refresh_token, api_domain, expires_in } = tokenData;

        // 2. Get User Info using the correct domain
        const zohoUser = await ZohoService.getUserInfo(access_token, api_domain);

        // 3. Link Account
        const userId = await resolveUser({
            id: zohoUser.id,
            email: zohoUser.email,
            name: zohoUser.name
        }, 'zoho', state);

        // 4. Save to DB (Store api_domain in metadata)
        await ConnectionModel.upsert({
            userId,
            provider: 'zoho',
            providerUserId: zohoUser.id,
            accessToken: access_token,
            refreshToken: refresh_token, 
            expiresAt: new Date(Date.now() + (expires_in * 1000)),
            metadata: { 
                name: zohoUser.name, 
                email: zohoUser.email,
                apiDomain: api_domain // <--- CRITICAL for Multi-DC support
            }
        });

        // 5. Redirect
        const user = await UserModel.findById(userId);
        const access = TokenService.generateAccessToken(user);
        const refresh = await TokenService.generateRefreshToken(user.id);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/callback?accessToken=${access}&refreshToken=${refresh}`);
        
    } catch (error) {
        console.error("Zoho Auth Error:", error);
        res.redirect('http://localhost:3000/login?error=ZohoFailed');
    }
};
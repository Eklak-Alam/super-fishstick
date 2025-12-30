const axios = require('axios');

// Python Agent URL (Running on port 8000)
const AGENT_URL = 'http://localhost:8000';

exports.chatWithAgent = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id; // Got from auth middleware

        // 1. Send user message to Python AI
        const response = await axios.post(`${AGENT_URL}/ask-agent`, {
            user_id: userId,
            message: message
        });

        // 2. Return AI's plan/response to Frontend
        res.json(response.data);

    } catch (error) {
        console.error("AI Service Error:", error.message);
        // If Python is offline, give a friendly error
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                message: "The AI Brain is currently sleeping (Service Offline).", 
                plan: [] 
            });
        }
        res.status(500).json({ error: "Failed to communicate with AI Agent" });
    }
};

exports.getPendingActions = async (req, res) => {
    try {
        const userId = req.user.id;
        const response = await axios.get(`${AGENT_URL}/pending-actions/${userId}`);
        res.json(response.data);
    } catch (error) {
        console.error("AI Actions Error:", error.message);
        res.status(500).json({ error: "Could not fetch pending actions" });
    }
};

exports.approveAction = async (req, res) => {
    try {
        const { actionId } = req.body;
        const userId = req.user.id;

        // 1. Tell Python to execute the approved action
        const response = await axios.post(`${AGENT_URL}/approve-action`, {
            user_id: userId,
            action_id: actionId
        });

        res.json(response.data);
    } catch (error) {
        console.error("AI Execute Error:", error.message);
        res.status(500).json({ error: "Action execution failed" });
    }
};
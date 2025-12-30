const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// Try importing middleware
const authMiddleware = require('../middlewares/auth.middleware');

// Handle different export styles (module.exports vs exports.authenticate)
const authenticate = authMiddleware.authenticate || authMiddleware;

// --- DEBUGGING LOGS (Check your terminal when you save this) ---
console.log("------------------------------------------------");
console.log("🔍 DEBUG AI ROUTES:");
console.log("1. Authenticate Function:", typeof authenticate === 'function' ? "✅ OK" : "❌ MISSING (Check src/middlewares/auth.middleware.js)");
console.log("2. Chat Controller:", typeof aiController.chatWithAgent === 'function' ? "✅ OK" : "❌ MISSING (Check src/controllers/ai.controller.js)");
console.log("3. Pending Controller:", typeof aiController.getPendingActions === 'function' ? "✅ OK" : "❌ MISSING");
console.log("4. Approve Controller:", typeof aiController.approveAction === 'function' ? "✅ OK" : "❌ MISSING");
console.log("------------------------------------------------");

// Prevent crash if functions are missing
if (typeof authenticate !== 'function' || typeof aiController.chatWithAgent !== 'function') {
    console.error("⛔ CRITICAL ERROR: One or more route handlers are undefined. Server cannot start this route.");
} else {
    // 🔒 All routes protected by Login
    router.post('/chat', authenticate, aiController.chatWithAgent);
    router.get('/actions', authenticate, aiController.getPendingActions);
    router.post('/approve', authenticate, aiController.approveAction);
}

module.exports = router;
const express = require('express');
const cors = require('cors');

// --- FIXED IMPORTS (Removed 'src/' prefix) ---
const authRoutes = require('./routes/auth.routes');
const platformRoutes = require('./routes/platform.routes');
const integrationRoutes = require('./routes/integration.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// 1. FIXED CORS CONFIGURATION
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 2. EXPRESS 5 FIX: PRE-FLIGHT CHECK
app.options(/.*/, cors()); 

app.use(express.json());

// 3. Routes
app.use('/api/auth', authRoutes);
app.use('/api', platformRoutes); // Handles /api/auth/google
app.use('/api/integrations', integrationRoutes); 

// 4. Health Check
app.get('/', (req, res) => {
    res.send('✅ Gaprio Backend is working!');
});

// 5. Error Handler
app.use(errorHandler);

module.exports = app;
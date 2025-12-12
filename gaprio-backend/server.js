const app = require('./src/app'); // Imports the Express App
require('dotenv').config();       // Loads .env variables

const PORT = process.env.PORT || 5000;

// This command keeps the server alive!
app.listen(PORT, () => {
    console.log(`\n=================================`);
    console.log(`🚀 GAPRIO SERVER STARTED`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📅 Mode: ${process.env.NODE_ENV}`);
    console.log(`=================================\n`);
});
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const quarantineRoutes = require('./routes/quarantine');
const whitelistRoutes = require('./routes/whitelist');
const adminRoutes = require('./routes/admin');
require('./scheduler/cleanup'); // Automatically schedules cleanup task
require('./scheduler/dailySummary'); // Automatically schedules daily summary

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quarantine', quarantineRoutes);
app.use('/api/whitelist', whitelistRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

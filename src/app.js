const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email'); // Email route
const settingsRoutes = require('./routes/settings'); // Settings route
const quarantineRoutes = require('./routes/quarantine'); // Quarantine route
const whitelistRoutes = require('./routes/whitelist'); // Whitelist route

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/quarantine', quarantineRoutes);
app.use('/api/whitelist', whitelistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require('express');
const UserSettings = require('../models/UserSettings');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get user settings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const settings = await UserSettings.findOne({ user: req.user.id });
    if (!settings) {
      return res.status(404).json({ message: 'User settings not found' });
    }
    res.json(settings);
  } catch (err) {
    console.error('Error fetching user settings:', err.message);
    res.status(500).json({ message: 'Error fetching user settings', error: err.message });
  }
});

// Update user settings
router.put('/', authMiddleware, async (req, res) => {
  const { notificationPreferences, quarantineRetention, customRules } = req.body;

  try {
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { user: req.user.id },
      { notificationPreferences, quarantineRetention, customRules },
      { new: true, upsert: true }
    );
    res.json(updatedSettings);
  } catch (err) {
    console.error('Error updating user settings:', err.message);
    res.status(500).json({ message: 'Error updating user settings', error: err.message });
  }
});

module.exports = router;

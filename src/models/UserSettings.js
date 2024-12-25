const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customAlwaysTrust: [String], // Domains or email addresses to always trust
  customAlwaysQuarantine: [String], // Keywords or email addresses to always quarantine
  quarantineRetention: {
    type: Number, // Retention period in days
    default: 30,
  },
  emailNotifications: {
    type: Boolean,
    default: true, // Whether the user wants email notifications
  },
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);

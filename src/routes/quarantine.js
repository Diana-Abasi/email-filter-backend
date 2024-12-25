const express = require('express');
const QuarantinedEmail = require('../models/QuarantinedEmail');
const Whitelist = require('../models/Whitelist');
const UserSettings = require('../models/UserSettings');
const authMiddleware = require('../middleware/authMiddleware');
const { sendEmail } = require('./email');

const router = express.Router();

// Default suspicious keywords
const defaultKeywords = ["prize", "win", "urgent", "click here", "claim", "offer"];

// Add a quarantined email
router.post('/', authMiddleware, async (req, res) => {
  const { sender, subject, body } = req.body;

  try {
    console.log('Incoming email:', { sender, subject, body });

    // Fetch user settings
    const userSettings = await UserSettings.findOne({ user: req.user.id });
    const customAlwaysTrust = userSettings?.customRules?.alwaysTrust || [];
    const customAlwaysQuarantine = userSettings?.customRules?.alwaysQuarantine || [];
    const quarantineRetention = userSettings?.quarantineRetention || 30;

    console.log('User settings loaded:', { customAlwaysTrust, customAlwaysQuarantine, quarantineRetention });

    // Check if the sender is in the whitelist or customAlwaysTrust
    const isWhitelisted = await Whitelist.findOne({ user: req.user.id, email: sender });
    console.log(`Sender ${sender} isWhitelisted:`, !!isWhitelisted);

    const isTrustedSender = customAlwaysTrust.some((rule) => sender.includes(rule));
    console.log(`Sender ${sender} isTrustedSender (customAlwaysTrust):`, isTrustedSender);

    if (isWhitelisted || isTrustedSender) {
      console.log('Sender is trusted and not quarantined:', sender);
      return res.status(200).json({ message: 'Email is trusted and not quarantined' });
    }

    // Combine default and custom quarantine keywords
    const combinedKeywords = [...defaultKeywords, ...customAlwaysQuarantine];
    const combinedText = `${subject} ${body}`.toLowerCase();

    const hasSuspiciousKeyword = combinedKeywords.some((keyword) =>
      combinedText.includes(keyword.toLowerCase())
    );

    let quarantineReason = 'Untrusted sender';
    if (hasSuspiciousKeyword) {
      quarantineReason = 'Suspicious content detected';
    }

    // Add the email to the quarantine
    const quarantinedEmail = new QuarantinedEmail({
      user: req.user.id,
      sender,
      subject,
      body,
    });

    const savedEmail = await quarantinedEmail.save();
    console.log('Quarantined email saved:', savedEmail);

    // Notify the user via email
    const userEmail = req.user.email;
    const emailText = `A new email has been quarantined:\n\nSender: ${sender}\nSubject: ${subject}\nReason: ${quarantineReason}`;
    try {
      await sendEmail(userEmail, 'Quarantined Email Notification', emailText);
    } catch (err) {
      console.error('Error sending email:', err.message);
    }

    res.status(201).json(savedEmail);
  } catch (err) {
    console.error('Error in quarantine route:', err.message);
    res.status(500).json({ message: 'Error adding email to quarantine', error: err.message });
  }
});

module.exports = router;

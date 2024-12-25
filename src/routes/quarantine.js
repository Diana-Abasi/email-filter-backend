const express = require('express');
const QuarantinedEmail = require('../models/QuarantinedEmail');
const Whitelist = require('../models/Whitelist');
const authMiddleware = require('../middleware/authMiddleware');
const { sendEmail } = require('../utils/email');

const router = express.Router();

const suspiciousKeywords = ["prize", "win", "urgent", "click here", "claim", "offer"];

router.post('/', authMiddleware, async (req, res) => {
  const { sender, subject, body } = req.body;

  try {
    console.log('Incoming email:', { sender, subject, body });

    // Check if the sender is in the whitelist
    const isWhitelisted = await Whitelist.findOne({ user: req.user.id, email: sender });
    console.log('Whitelist check result:', isWhitelisted);

    if (isWhitelisted) {
      return res.status(200).json({ message: 'Email is trusted and not quarantined' });
    }

    // Check for suspicious keywords
    const combinedText = `${subject} ${body}`.toLowerCase();
    const hasSuspiciousKeyword = suspiciousKeywords.some((keyword) =>
      combinedText.includes(keyword.toLowerCase())
    );
    console.log('Contains suspicious keyword:', hasSuspiciousKeyword);

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
    sendEmail(userEmail, 'Quarantined Email Notification', emailText);

    res.status(201).json(savedEmail);
  } catch (err) {
    console.error('Error in quarantine route:', err.message);
    res.status(500).json({ message: 'Error adding email to quarantine', error: err.message });
  }
});

module.exports = router;

const express = require('express');
const Whitelist = require('../models/Whitelist');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add an email to the whitelist
router.post('/', authMiddleware, async (req, res) => {
  const { email } = req.body;

  try {
    const whitelistEntry = new Whitelist({
      user: req.user.id,
      email,
    });

    const savedWhitelist = await whitelistEntry.save();

    // Debug: Log saved whitelist entry
    console.log('Saved whitelist entry:', savedWhitelist);

    res.status(201).json(savedWhitelist);
  } catch (err) {
    console.error('Error adding email to whitelist:', err.message); // Debugging log
    res.status(500).json({ message: 'Error adding email to whitelist', error: err.message });
  }
});

// Retrieve all whitelisted emails
router.get('/', authMiddleware, async (req, res) => {
  try {
    const whitelistedEmails = await Whitelist.find({ user: req.user.id });

    // Debug: Log retrieved whitelist emails
    console.log('Retrieved whitelist emails:', whitelistedEmails);

    res.json(whitelistedEmails);
  } catch (err) {
    console.error('Error retrieving whitelist:', err.message);
    res.status(500).json({ message: 'Error retrieving whitelist', error: err.message });
  }
});

module.exports = router;

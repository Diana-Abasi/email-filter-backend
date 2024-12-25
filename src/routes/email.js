const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const filterEmail = require('../utils/emailFilter');

const router = express.Router();

// Handle incoming email
router.post('/incoming', authMiddleware, async (req, res) => {
  const { sender, subject, body } = req.body;

  if (!sender || !subject || !body) {
    return res.status(400).json({ message: 'Sender, subject, and body are required' });
  }

  try {
    const result = await filterEmail(req.user.id, sender, subject, body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error processing incoming email:', err.message);
    res.status(500).json({ message: 'Error processing incoming email', error: err.message });
  }
});

module.exports = router;

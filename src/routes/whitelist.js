const express = require('express');
const Whitelist = require('../models/Whitelist');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all whitelist entries for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const whitelist = await Whitelist.find({ user: req.user.id });
    res.status(200).json(whitelist);
  } catch (err) {
    console.error('Error fetching whitelist:', err.message);
    res.status(500).json({ message: 'Error fetching whitelist', error: err.message });
  }
});

// Add a new email to the whitelist
router.post('/', authMiddleware, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingEntry = await Whitelist.findOne({ user: req.user.id, email });
    if (existingEntry) {
      return res.status(400).json({ message: 'Email is already in the whitelist' });
    }

    const whitelistEntry = new Whitelist({ user: req.user.id, email });
    const savedEntry = await whitelistEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error('Error adding email to whitelist:', err.message);
    res.status(500).json({ message: 'Error adding email to whitelist', error: err.message });
  }
});

// Delete a whitelist entry by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const whitelistEntry = await Whitelist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!whitelistEntry) {
      return res.status(404).json({ message: 'Whitelist entry not found' });
    }

    res.status(200).json({ message: 'Whitelist entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting whitelist entry:', err.message);
    res.status(500).json({ message: 'Error deleting whitelist entry', error: err.message });
  }
});

module.exports = router;

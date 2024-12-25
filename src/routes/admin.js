const express = require('express');
const QuarantinedEmail = require('../models/QuarantinedEmail');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get quarantine statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await QuarantinedEmail.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $project: { user: "$_id", count: 1, _id: 0 } }
    ]);

    res.json(stats);
  } catch (err) {
    console.error('Error fetching quarantine stats:', err.message);
    res.status(500).json({ message: 'Error fetching quarantine stats', error: err.message });
  }
});

module.exports = router;

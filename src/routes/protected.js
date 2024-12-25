const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}! This is a protected route.` });
});

module.exports = router;

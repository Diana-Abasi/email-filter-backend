const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Authorization header missing'); // Debug log
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email }; // Attach user info to request

    console.log('Decoded user from token:', req.user); // Debug log
    next();
  } catch (err) {
    console.error('Invalid token:', err.message); // Debugging log
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;

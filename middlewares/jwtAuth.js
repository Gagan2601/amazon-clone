const jwt = require('jsonwebtoken');
const JWT_SECRET = 'GaganGigaC$had';
const authenticateToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
const signToken = (tokenPayload) => {
  return jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = { authenticateToken, signToken };
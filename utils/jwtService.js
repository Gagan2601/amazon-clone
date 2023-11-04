const jwt = require('jsonwebtoken');

class JwtService {
  static sign(payload, secret = process.env.ACCESS_TOKEN_KEY, expiry = "30m") {
    const token = jwt.sign(payload, secret, { expiresIn: expiry });
    return token;
  }

  static verify(token, secret = process.env.ACCESS_TOKEN_KEY) {
    return jwt.verify(token, secret);
  }
}

module.exports = JwtService;
const { ErrorHandler } = require('./errorHandler');
const bigPromise = require("./bigPromise");
const JwtService = require('../utils/jwtService');

const authenticateToken = bigPromise((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return ErrorHandler(res, 400, "unAuthorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const { _id,email } = JwtService.verify(token);
    req.user = {
      _id,
      email
    };
    next();
  } catch (err) {
    return ErrorHandler(res, 403, 'Invalid token');
  }
});

module.exports = { authenticateToken };
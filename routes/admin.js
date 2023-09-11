const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/jwtAuth');
const admin = require('../controllers/admin');

router.get('/analytics', authenticateToken, admin.analytics);

module.exports = router;
const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middlewares/jwtAuth');
const auth = require('../controllers/auth');

router.post('/user/register', auth.userRegister);
router.post('/user/login', auth.userLogin);
router.get('/user/profile', authenticateToken, auth.userData);

router.post('/seller/register', auth.sellerRegister);
router.post('/seller/login', auth.sellerLogin);
router.get('/seller/profile', authenticateToken, auth.sellerData);

module.exports = router;
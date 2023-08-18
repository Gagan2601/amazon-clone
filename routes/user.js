const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/jwtAuth');
const user = require('../controllers/user')

router.post('/user/save-address', authenticateToken, user.saveUserAddress);
router.put('/users/:id', authenticateToken, user.changeUserInfo);

router.post('/seller/save-address', authenticateToken, user.saveSellerAddress);
router.put('/sellers/:id', authenticateToken, user.changeSellerInfo);

router.post('/add-to-cart', authenticateToken, user.addToCart);

router.delete('/remove-from-cart/:id', authenticateToken, user.removeFromCart);

router.post('/order', authenticateToken, user.order);

router.get('/orders/me', authenticateToken, user.myOrders);

router.delete('/cancel-order/:id', authenticateToken, user.cancelOrder);

// //This router needs to be put at correct place with correct authentication
// router.post('/change-order-status', user.changeStatus);

module.exports = router;
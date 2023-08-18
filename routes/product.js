const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/jwtAuth');
const products = require('../controllers/product')

router.post('/add-product', authenticateToken, products.addProduct);

router.put('/update-product/:productId', authenticateToken, products.updateProduct);

router.delete('/delete-product/:productId', authenticateToken, products.deleteProduct);

router.get('/products', products.viewProduct);

router.get('/products/search/:name', authenticateToken, products.searchProduct);

router.post('/review-product', authenticateToken, products.reviewProduct);

router.get('/deal-of-day', authenticateToken, products.dealoftheday);

module.exports = router;
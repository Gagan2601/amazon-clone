import express from "express";
import { Router } from "express";
import { authenticateToken } from "../middlewares/jwtAuth";
import * as products from "../controllers/product";

const router: Router = express.Router();

router.post("/add-product", authenticateToken, products.addProduct);

router.put(
  "/update-product/:productId",
  authenticateToken,
  products.updateProduct
);

router.delete(
  "/delete-product/:productId",
  authenticateToken,
  products.deleteProduct
);

router.get("/seller-products/", authenticateToken, products.getSellerProducts);

router.get("/products", products.viewProduct);

router.get("/products/search/:name", authenticateToken, products.searchProduct);

router.get("/reviews/:id", authenticateToken, products.getReviewsByProductId);

router.post("/review-product", authenticateToken, products.reviewProduct);

router.get("/deal-of-day", authenticateToken, products.dealoftheday);

router.get("/products/filter", products.filterAndSortProducts);

router.post("/create-checkout-session", products.checkout);
// Example: /products/filter?category=Electronics&minPrice=100&maxPrice=500&sortBy=discountedPrice&sortOrder=asc

router.get(
  "/products/:productId",
  authenticateToken,
  products.fetchProductDetails
);

export default router;

import express, { Router } from "express";
import { authenticateToken } from "../middlewares/jwtAuth";
import * as userController from "../controllers/user";

const router: Router = express.Router();

router.post(
  "/user/save-address",
  authenticateToken,
  userController.saveUserAddress
);
router.put("/user/:id", authenticateToken, userController.changeUserInfo);
router.get("/user/:id", authenticateToken, userController.getUserInfo);

router.post(
  "/seller/save-address",
  authenticateToken,
  userController.saveSellerAddress
);
router.put("/sellers/:id", authenticateToken, userController.changeSellerInfo);

router.get("/cart", authenticateToken, userController.getCartContents);

router.post("/add-to-cart", authenticateToken, userController.addToCart);

router.delete(
  "/remove-from-cart/:id",
  authenticateToken,
  userController.removeFromCart
);

router.post("/order", authenticateToken, userController.order);

router.get(
  "/seller/notifications",
  authenticateToken,
  userController.getSellerNotifications
);

router.get("/orders/me", authenticateToken, userController.myOrders);

router.delete(
  "/cancel-order/:id",
  authenticateToken,
  userController.cancelOrder
);

router.get(
  "/sellers/order/:id",
  authenticateToken,
  userController.getSellerOrderDetails
);

router.put(
  "/sellers/order-status/:id",
  authenticateToken,
  userController.updateOrderStatus
);

router.get(
  "/sellers/orders",
  authenticateToken,
  userController.getSellerOrders
);

// This router needs to be put at the correct place with correct authentication
// router.post('/change-order-status', userController.changeStatus);

export default router;

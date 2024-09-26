import express from "express";
import { Router } from "express";
import { authenticateToken } from "../middlewares/jwtAuth";
import * as auth from "../controllers/auth";

const router: Router = express.Router();

router.post("/user/register", auth.userRegister);
router.post("/user/login", auth.userLogin);
router.get("/user/profile", authenticateToken, auth.userData);

router.post("/seller/register", auth.sellerRegister);
router.post("/seller/login", auth.sellerLogin);
router.get("/seller/profile", authenticateToken, auth.sellerData);

router.post("/admin/register", auth.adminRegister);
router.post("/admin/login", auth.adminLogin);

export default router;

import { refresh } from "../controllers/refresh";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/refresh", refresh);

export default router;

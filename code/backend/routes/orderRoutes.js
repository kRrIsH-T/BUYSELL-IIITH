import express from "express";
import { createOrder, getOrderHistory, getPendingOrders, getBoughtOrders, getSoldOrders, verifyOtp } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/history", getOrderHistory);
router.get("/pending/:userId", getPendingOrders);
router.get("/bought/:userId", getBoughtOrders);
router.get("/sold/:userId", getSoldOrders);
router.post("/verify-otp", verifyOtp);

export default router;
import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/:id/read", protectRoute, markAsRead);

export default router;
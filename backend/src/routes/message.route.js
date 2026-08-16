import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {logger} from "../middlewares/logger.js";
import { getMessages, getUsersForSidebar, sendMessage, markAsRead } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage, logger);
router.put("/read/:id", protectRoute, markAsRead);

export default router;
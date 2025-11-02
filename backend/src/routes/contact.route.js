import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addContact, getContacts, blockUser, unblockUser, getBlockedUsers } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/add", protectRoute, addContact);
router.get("/", protectRoute, getContacts);
router.post("/block/:userId", protectRoute, blockUser);
router.post("/unblock/:userId", protectRoute, unblockUser);
router.get("/blocked", protectRoute, getBlockedUsers);

export default router;
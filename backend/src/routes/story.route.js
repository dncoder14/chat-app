import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createStory, getStories, deleteStory } from "../controllers/story.controller.js";

const router = express.Router();

router.post("/", protectRoute, createStory);
router.get("/", protectRoute, getStories);
router.delete("/:storyId", protectRoute, deleteStory);

export default router;
import { prisma } from "../lib/prisma.js";
import { cloudinary } from "../lib/cloudinary.js";

export const createStory = async (req, res) => {
    try {
        const { content, mediaType } = req.body;
        const userId = req.user.id;
        let mediaUrl = "";

        if (mediaType === "image" && req.body.image) {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image);
            mediaUrl = uploadResponse.secure_url;
        }

        const story = await prisma.story.create({
            data: {
                ownerId: userId,
                content,
                mediaUrl,
                mediaType,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            },
            include: {
                owner: {
                    select: { id: true, fullName: true, profilePic: true }
                }
            }
        });

        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getStories = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const contactIds = Array.isArray(user?.contacts) ? user.contacts : [];
        
        const stories = await prisma.story.findMany({
            where: {
                ownerId: { in: [...contactIds, userId] },
                expiresAt: { gt: new Date() }
            },
            include: {
                owner: {
                    select: { id: true, fullName: true, profilePic: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(stories);
    } catch (error) {
        console.log("Error in getStories:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user.id;

        const story = await prisma.story.findFirst({ 
            where: { id: storyId, ownerId: userId }
        });
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        await prisma.story.delete({ where: { id: storyId } });
        res.status(200).json({ message: "Story deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
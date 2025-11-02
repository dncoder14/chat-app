import { prisma } from "../lib/prisma.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await prisma.notification.findMany({
            where: { recipientId: userId },
            include: {
                sender: {
                    select: { id: true, fullName: true, profilePic: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        await prisma.notification.updateMany({
            where: { id: id, recipientId: userId },
            data: { isRead: true }
        });
        
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
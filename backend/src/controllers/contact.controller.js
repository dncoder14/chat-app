import { prisma } from "../lib/prisma.js";

export const addContact = async (req, res) => {
    try {
        const { phone } = req.body;
        const userId = req.user.id;

        const contact = await prisma.user.findUnique({ 
            where: { phone },
            select: { id: true, fullName: true, email: true, phone: true, profilePic: true }
        });
        if (!contact) {
            return res.status(404).json({ message: "User not found" });
        }

        if (contact.id === userId) {
            return res.status(400).json({ message: "Cannot add yourself" });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const currentContacts = Array.isArray(user.contacts) ? user.contacts : [];
        
        if (currentContacts.includes(contact.id)) {
            return res.status(400).json({ message: "Contact already added" });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { contacts: [...currentContacts, contact.id] }
        });

        res.status(200).json({ message: "Contact added successfully", contact });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const contactIds = Array.isArray(user.contacts) ? user.contacts : [];
        const contacts = contactIds.length > 0 ? await prisma.user.findMany({
            where: { id: { in: contactIds } },
            select: { id: true, fullName: true, email: true, phone: true, profilePic: true }
        }) : [];
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const blockUser = async (req, res) => {
    try {
        const { userId: targetUserId } = req.params;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const currentBlocked = Array.isArray(user.blockedUsers) ? user.blockedUsers : [];
        
        if (!currentBlocked.includes(targetUserId)) {
            await prisma.user.update({
                where: { id: userId },
                data: { blockedUsers: [...currentBlocked, targetUserId] }
            });
        }

        res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { userId: targetUserId } = req.params;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const currentBlocked = Array.isArray(user.blockedUsers) ? user.blockedUsers : [];
        const updatedBlockedUsers = currentBlocked.filter(id => id !== targetUserId);
        await prisma.user.update({
            where: { id: userId },
            data: { blockedUsers: updatedBlockedUsers }
        });

        res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getBlockedUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const blockedUserIds = Array.isArray(user.blockedUsers) ? user.blockedUsers : [];
        const blockedUsers = blockedUserIds.length > 0 ? await prisma.user.findMany({
            where: { id: { in: blockedUserIds } },
            select: { id: true, fullName: true, email: true, phone: true, profilePic: true }
        }) : [];
        res.status(200).json(blockedUsers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
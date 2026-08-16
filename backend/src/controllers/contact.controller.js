import { prisma } from "../lib/prisma.js";

export const addContact = async (req, res) => {
    try {
        const { phone } = req.body;
        const userId = req.user.id;

        const contact = await prisma.user.findUnique({ 
            where: { phone },
            select: { id: true, fullName: true, phone: true, profilePic: true }
        });
        if (!contact) {
            return res.status(404).json({ message: "User not found" });
        }

        if (contact.id === userId) {
            return res.status(400).json({ message: "Cannot add yourself" });
        }

        // Atomic jsonb append guarded by a containment check, so two concurrent
        // requests can't race and clobber each other's write (lost update).
        const [updated] = await prisma.$queryRaw`
            UPDATE users
            SET contacts = contacts || to_jsonb(${contact.id}::text)
            WHERE id = ${userId} AND NOT (contacts @> to_jsonb(${contact.id}::text))
            RETURNING id
        `;

        if (!updated) {
            return res.status(400).json({ message: "Contact already added" });
        }

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
            select: { id: true, fullName: true, phone: true, profilePic: true }
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

        // Atomic jsonb append guarded by a containment check, avoids the
        // read-modify-write race the previous implementation had.
        await prisma.$executeRaw`
            UPDATE users
            SET "blockedUsers" = "blockedUsers" || to_jsonb(${targetUserId}::text)
            WHERE id = ${userId} AND NOT ("blockedUsers" @> to_jsonb(${targetUserId}::text))
        `;

        res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { userId: targetUserId } = req.params;
        const userId = req.user.id;

        // Atomic jsonb element removal, avoids the read-modify-write race
        // the previous implementation had.
        await prisma.$executeRaw`
            UPDATE users
            SET "blockedUsers" = COALESCE(
                (SELECT jsonb_agg(elem) FROM jsonb_array_elements("blockedUsers") elem WHERE elem <> to_jsonb(${targetUserId}::text)),
                '[]'::jsonb
            )
            WHERE id = ${userId}
        `;

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
            select: { id: true, fullName: true, phone: true, profilePic: true }
        }) : [];
        res.status(200).json(blockedUsers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
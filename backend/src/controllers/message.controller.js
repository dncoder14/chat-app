import { prisma } from "../lib/prisma.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { cloudinary } from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        
        // Get current user with contacts
        const currentUser = await prisma.user.findUnique({
            where: { id: loggedInUserId },
            select: { contacts: true, blockedUsers: true }
        });
        
        // Parse contacts array from JSON
        const contactIds = Array.isArray(currentUser.contacts) ? currentUser.contacts : [];
        
        // Get messages to find all users who have messaged with current user
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: loggedInUserId },
                    { receiverId: loggedInUserId }
                ]
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        fullName: true,
                        profilePic: true,
                        phone: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        fullName: true,
                        profilePic: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        // Build user map with all users (contacts + message participants)
        const userMap = new Map();
        
        // Add users from messages first
        messages.forEach(message => {
            const otherUserId = message.senderId === loggedInUserId 
                ? message.receiverId 
                : message.senderId;
            
            const otherUser = message.senderId === loggedInUserId 
                ? message.receiver 
                : message.sender;
            
            if (!userMap.has(otherUserId)) {
                userMap.set(otherUserId, {
                    ...otherUser,
                    _id: otherUser.id,
                    unreadCount: 0,
                    lastMessage: message
                });
            }
            
            // Count unread messages
            if (message.receiverId === loggedInUserId && !message.isRead) {
                userMap.get(otherUserId).unreadCount++;
            }
            
            // Update last message if this one is newer
            if (message.createdAt > userMap.get(otherUserId).lastMessage.createdAt) {
                userMap.get(otherUserId).lastMessage = message;
            }
        });
        
        // Add contacts who don't have messages yet
        if (contactIds.length > 0) {
            const contacts = await prisma.user.findMany({
                where: { id: { in: contactIds } },
                select: {
                    id: true,
                    fullName: true,
                    profilePic: true,
                    phone: true
                }
            });
            
            contacts.forEach(contact => {
                if (!userMap.has(contact.id)) {
                    userMap.set(contact.id, {
                        ...contact,
                        _id: contact.id,
                        unreadCount: 0,
                        lastMessage: null
                    });
                }
            });
        }
        
        const users = Array.from(userMap.values());
        
        // Don't filter out blocked users - they should still appear in sidebar
        // Blocking is handled in the chat interface, not in the sidebar

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user.id;

        // Check if users have blocked each other
        const [currentUser, otherUser] = await Promise.all([
            prisma.user.findUnique({ where: { id: myId } }),
            prisma.user.findUnique({ where: { id: userToChatId } })
        ]);

        const currentUserBlocked = Array.isArray(currentUser.blockedUsers) ? currentUser.blockedUsers : [];
        const otherUserBlocked = Array.isArray(otherUser.blockedUsers) ? otherUser.blockedUsers : [];
        const isBlocked = currentUserBlocked.includes(userToChatId) || otherUserBlocked.includes(myId);

        if (isBlocked) {
            return res.status(200).json([]);
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: myId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: myId }
                ]
            },
            include: {
                sender: {
                    select: { id: true, fullName: true, profilePic: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        // Validate message content
        if (!text && !image) {
            return res.status(400).json({ error: "Message content is required" });
        }
        
        if (text && text.length > 1000) {
            return res.status(400).json({ error: "Message too long" });
        }

        // Check if sender is blocked by receiver or sender has blocked receiver
        const [receiver, sender] = await Promise.all([
            prisma.user.findUnique({ where: { id: receiverId } }),
            prisma.user.findUnique({ where: { id: senderId } })
        ]);
        
        const receiverBlocked = Array.isArray(receiver.blockedUsers) ? receiver.blockedUsers : [];
        const senderBlocked = Array.isArray(sender.blockedUsers) ? sender.blockedUsers : [];
        
        if (receiverBlocked.includes(senderId) || senderBlocked.includes(receiverId)) {
            return res.status(403).json({ error: "Cannot send message to blocked user" });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                text,
                image: imageUrl,
                isDelivered: true,
                isRead: false
            },
            include: {
                sender: {
                    select: { id: true, fullName: true, profilePic: true }
                }
            }
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            const { io } = await import("../index.js");
            // Emit both events for different listeners
            io.to(receiverSocketId).emit("newMessage", newMessage);
            io.to(receiverSocketId).emit("newMessage_chat", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const currentUserId = req.user.id;

        await prisma.message.updateMany({
            where: {
                senderId: userId,
                receiverId: currentUserId,
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });

        // Emit read status to sender
        const senderSocketId = getReceiverSocketId(userId);
        if (senderSocketId) {
            const { io } = await import("../index.js");
            io.to(senderSocketId).emit("messagesRead", { readBy: currentUserId });
        }

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.log("Error in markAsRead controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
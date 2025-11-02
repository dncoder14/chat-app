import { prisma } from "./prisma.js";

const userSocketMap = {};

export const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        
        if (userId) {
            userSocketMap[userId] = socket.id;
            prisma.user.update({ 
                where: { id: userId }, 
                data: { isOnline: true } 
            });
            
            // Send current online users to the new connection
            socket.emit("getOnlineUsers", Object.keys(userSocketMap));
            
            // Broadcast to all users that this user is online
            socket.broadcast.emit("userOnline", userId);
        }

        socket.on("typing", ({ receiverId, isTyping }) => {
            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("userTyping", {
                    senderId: userId,
                    isTyping
                });
            }
        });

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
        });

        socket.on("sendMessage", (messageData) => {
            const receiverSocketId = userSocketMap[messageData.receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", messageData);
            }
        });

        socket.on("storyUpdate", (storyData) => {
            socket.broadcast.emit("newStory", storyData);
        });

        socket.on("disconnect", () => {
            if (userId) {
                delete userSocketMap[userId];
                prisma.user.update({ 
                    where: { id: userId },
                    data: { 
                        isOnline: false, 
                        lastSeen: new Date() 
                    }
                });
                socket.broadcast.emit("userOffline", userId);
            }
        });
    });
};

export const getOnlineUsers = () => {
    return Object.keys(userSocketMap);
};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
import { prisma } from "./prisma.js";

const userSocketMap = {};
const connectionAttempts = new Map();
const HEARTBEAT_INTERVAL = 25000; // 25 seconds

export const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        
        if (userId) {
            userSocketMap[userId] = socket.id;
            
            // Batch database updates to reduce load
            setTimeout(() => {
                prisma.user.update({ 
                    where: { id: userId }, 
                    data: { isOnline: true } 
                }).catch(console.error);
            }, 100);
            
            // Send current online users to the new connection
            socket.emit("getOnlineUsers", Object.keys(userSocketMap));
            
            // Broadcast to all users that this user is online
            socket.broadcast.emit("userOnline", userId);
            
            // Setup heartbeat
            const heartbeat = setInterval(() => {
                socket.emit('ping');
            }, HEARTBEAT_INTERVAL);
            
            socket.on('pong', () => {
                // Client is alive
            });
            
            socket.heartbeat = heartbeat;
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
                
                // Clear heartbeat
                if (socket.heartbeat) {
                    clearInterval(socket.heartbeat);
                }
                
                // Batch database updates
                setTimeout(() => {
                    prisma.user.update({ 
                        where: { id: userId },
                        data: { 
                            isOnline: false, 
                            lastSeen: new Date() 
                        }
                    }).catch(console.error);
                }, 100);
                
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
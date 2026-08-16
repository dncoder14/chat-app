import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import contactRoutes from "./routes/contact.route.js";
import storyRoutes from "./routes/story.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { initializeSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
});

app.use(cors({ 
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true 
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Pinged periodically (.github/workflows/keepalive.yml) to keep the
// free-tier Render instance and DB connection from going idle. Deliberately
// unauthenticated and outside /api to stay simple to hit externally.
app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
    } catch (error) {
        console.error("Health check DB query failed:", error.message);
        res.status(503).json({ status: "error", db: "disconnected", timestamp: new Date().toISOString() });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/notifications", notificationRoutes);

initializeSocket(io);

const STORY_CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

const cleanupExpiredStories = async () => {
    try {
        const { count } = await prisma.story.deleteMany({
            where: { expiresAt: { lt: new Date() } }
        });
        if (count > 0) {
            console.log(`Cleaned up ${count} expired stor${count === 1 ? "y" : "ies"}`);
        }
    } catch (error) {
        console.error("Error cleaning up expired stories:", error);
    }
};

const PORT = process.env.PORT || 5001;
server.listen(PORT, async () => {
    console.log("Server is listening at PORT:" + PORT);
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
        cleanupExpiredStories();
        setInterval(cleanupExpiredStories, STORY_CLEANUP_INTERVAL);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});

// Error handling to prevent crashes
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit, just log the error
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

export { io };
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, "../logs.txt");

export function logger(req) {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        const content = text ? text : image ? "[image]" : "";
        const line = `${new Date().toISOString()} | ${senderId} -> ${receiverId} | ${content}\n`;
        fs.appendFileSync(LOG_FILE, line);
    } catch (error) {
        console.log("Error in logger middleware:", error.message);
    }
}

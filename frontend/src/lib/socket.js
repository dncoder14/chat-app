import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export const initializeSocket = (userId) => {
  return io(BASE_URL, {
    query: {
      userId,
    },
  });
};
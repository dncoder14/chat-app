import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export const initializeSocket = (userId) => {
  const socket = io(BASE_URL, {
    query: {
      userId,
    },
    transports: ['websocket', 'polling'],
    upgrade: true,
    rememberUpgrade: true,
  });
  
  // Handle heartbeat
  socket.on('ping', () => {
    socket.emit('pong');
  });
  
  return socket;
};
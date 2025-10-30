import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

type EventHandlers = {
  [event: string]: (payload: any) => void;
};

const useSocket = (
  userId: string | null,
  handlers: EventHandlers = {}
) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) {
      console.log("🛑 No userId provided, disconnecting socket...");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // Avoid reconnect if already connected for same user
    if (prevUserId.current === userId && socketRef.current) {
      console.log("✅ Socket already connected for this user.");
      return;
    }

    prevUserId.current = userId;
    const serverUrl = import.meta.env.VITE_SOCKET_URL;
    console.log("🌍 Connecting to socket server:", serverUrl);

    const socket = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      transports: ["websocket", "polling"],
      query: { userId }, // 👈 Optionally send userId in connection query
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      setIsConnected(true);

      // 👉 Join user-specific room
      socket.emit("joinUser", { userId });
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`🔄 Reconnected after ${attempt} attempts`);
      setIsConnected(true);
      socket.emit("joinUser", { userId }); // 👉 Re-join on reconnect
    });

    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    return () => {
      console.log("🧹 Cleaning up socket connection...");
      if (socketRef.current) {
        socketRef.current.emit("leaveUserRoom", { userId });
        socketRef.current.disconnect();
      }
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [userId]);

  // ✅ Bind event handlers
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    for (const [event, callback] of Object.entries(handlers)) {
      socket.on(event, callback);
    }

    return () => {
      for (const event of Object.keys(handlers)) {
        socket.off(event);
      }
    };
  }, [handlers]);

  // ✅ Safe emitter
  const emit = (event: string, payload: any) => {
    if (!socketRef.current) {
      console.error("🚨 Cannot emit: Socket not initialized.");
      return;
    }
    socketRef.current.emit(event, payload);
  };

  return { isConnected, emit };
};

export default useSocket;
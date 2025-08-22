import { io, Socket } from "socket.io-client";
import { environment } from "../config/environment";

let socket: Socket;

export const connectSocket = () => {
  //console.log(environment.socket_url);
  
  socket = io(environment.socket_url, {
    path: '/socket.io',
    transports: [ "polling", "websocket"],
    secure: true,
  });
  socket.on("connect", () => {
    console.log("Connected to the socket server");
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from the socket server");
  });
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket is not initialized. Call connectSocket() first.");
  }
  return socket;
};

import { Server, Socket } from "socket.io";
import { handleFileOperations } from "./fileHandler";
import { handleTerminalOperations } from "./terminalHandler";

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);
    handleFileOperations(socket);
    handleTerminalOperations(socket);
    socket.on("ping", () => {
      socket.emit("pong");
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};

import { Socket } from "socket.io";
import path from "path";
import fs from "fs/promises";

export const handleFileOperations = (socket: Socket) => {
  socket.on("request-file-content", async (data: any) => {
    const { filePath, projectId } = data;
    const safePath = path.join(__dirname, "../../fetched_active_projects", filePath);
    const content = await fs.readFile(safePath, "utf-8");
    socket.emit("file-content-response", { filePath, content, projectId });
  });

  socket.on("save-file-content", async (data: any) => {
    const { filePath, content, projectId } = data;
    const safePath = path.join(__dirname, "../../fetched_active_projects", filePath);
    await fs.writeFile(safePath, content, "utf-8");
    socket.emit("file-save-response", { filePath, success: true, projectId });
  });
};

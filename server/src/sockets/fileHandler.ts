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

  socket.on("create-file", async (data: any) => {
    const { filePath, projectId } = data;
    const safePath = path.join(__dirname, "../../fetched_active_projects", filePath);
    try {
      await fs.writeFile(safePath, "", { flag: "wx" });
      socket.emit("file-create-response", { filePath, success: true, projectId });
    } catch (error) {
      socket.emit("file-create-response", { filePath, success: false, error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error), projectId });
    }
  });

  socket.on("delete-file", async (data: any) => {
    const { filePath, projectId } = data;
    const safePath = path.join(__dirname, "../../fetched_active_projects", filePath);
    try {
      await fs.unlink(safePath);
      socket.emit("file-delete-response", { filePath, success: true, projectId });
    } catch (error) {
      socket.emit("file-delete-response", { filePath, success: false, error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error), projectId });
    }
  });
};

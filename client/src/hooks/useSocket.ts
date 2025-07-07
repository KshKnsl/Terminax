import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

interface UseSocketProps {
  onFileContent?: (data: { filePath: string; content: string; projectId?: string }) => void;
  onFileError?: (data: { filePath: string; error: string }) => void;
  onFileSaved?: (data: { filePath: string; success: boolean; projectId?: string }) => void;
  onFileSaveError?: (data: { filePath: string; error: string }) => void;
}

export const useSocket = ({
  onFileContent,
  onFileError,
  onFileSaved,
  onFileSaveError,
}: UseSocketProps = {}) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SERVER_URL, {
      withCredentials: true,
    });

    const socket = socketRef.current;

    if (onFileContent) {
      socket.on("file-content-response", onFileContent);
    }
    if (onFileError) {
      socket.on("file-content-error", onFileError);
    }
    if (onFileSaved) {
      socket.on("file-save-response", onFileSaved);
    }
    if (onFileSaveError) {
      socket.on("file-save-error", onFileSaveError);
    }

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [onFileContent, onFileError, onFileSaved, onFileSaveError]);

  const requestFileContent = (filePath: string, projectId?: string) => {
    if (socketRef.current) {
      socketRef.current.emit("request-file-content", { filePath, projectId });
    }
  };

  const saveFileContent = (filePath: string, content: string, projectId?: string) => {
    if (socketRef.current) {
      socketRef.current.emit("save-file-content", { filePath, content, projectId });
    }
  };

  return {
    requestFileContent,
    saveFileContent,
    socket: socketRef.current,
  };
};

import { Socket } from "socket.io";

export const handleTerminalOperations = (socket: Socket) => {
  socket.on("terminal-command", (data: any) => {
    const { command, projectId } = data;

    console.log(`Terminal command for project ${projectId}:`, command);

    socket.emit("terminal-output", {
      projectId,
      output: `Command received: ${command}\n`,
      type: "stdout",
    });
  });

  socket.on("create-terminal-session", (data: any) => {
    const { projectId } = data;
    console.log(`Creating terminal session for project: ${projectId}`);

    socket.emit("terminal-session-created", {
      projectId,
      sessionId: `session_${Date.now()}`,
      status: "ready",
    });
  });

  socket.on("destroy-terminal-session", (data: any) => {
    const { sessionId } = data;
    console.log(`Destroying terminal session: ${sessionId}`);
    socket.emit("terminal-session-destroyed", {
      sessionId,
      status: "destroyed",
    });
  });
};

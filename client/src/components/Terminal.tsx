import React, { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X, Minus, Square, Terminal as TerminalIcon } from "lucide-react";

interface TerminalProps {
  className?: string;
}

const Terminal: React.FC<TerminalProps> = ({ className = "" }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([
    { command: "", output: 'Welcome to Terminax Terminal\nType "help" for available commands.' },
  ]);
  const [currentPath] = useState("~/workspace");

  const executeCommand = (command: string) => {
    let output = "";

    switch (command.toLowerCase().trim()) {
      case "help":
        output = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  ls       - List directory contents
  pwd      - Print working directory
  echo     - Echo text
  date     - Show current date and time
  whoami   - Show current user`;
        break;
      case "clear":
        setHistory([]);
        return;
      case "ls":
        output = "src/\ncomponents/\npackage.json\nREADME.md\ntsconfig.json";
        break;
      case "pwd":
        output = currentPath;
        break;
      case "date":
        output = new Date().toString();
        break;
      case "whoami":
        output = "developer";
        break;
      case "":
        return;
      default:
        if (command.startsWith("echo ")) {
          output = command.substring(5);
        } else {
          output = `Command not found: ${command}\nType "help" for available commands.`;
        }
    }

    setHistory((prev) => [...prev, { command, output }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      className={`h-full flex flex-col bg-black dark:bg-black text-green-400 font-mono text-sm ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#171717] dark:bg-[#171717] border-b border-gray-600 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-200">Terminal</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-3 space-y-1">
        {history.map((entry, index) => (
          <div key={index}>
            {entry.command && (
              <div className="flex items-center">
                <span className="text-blue-400">developer@terminax</span>
                <span className="text-white">:</span>
                <span className="text-yellow-400">{currentPath}</span>
                <span className="text-white">$ </span>
                <span className="text-green-400">{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <div className="whitespace-pre-wrap text-gray-300 ml-0">{entry.output}</div>
            )}
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-center">
          <span className="text-blue-400">developer@terminax</span>
          <span className="text-white">:</span>
          <span className="text-yellow-400">{currentPath}</span>
          <span className="text-white">$ </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

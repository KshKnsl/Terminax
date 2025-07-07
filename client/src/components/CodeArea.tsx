"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import Editor from "@monaco-editor/react";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";

interface CodeAreaProps {
  openFiles: string[];
  activeFile: string | null;
  onFileSelect: (filePath: string) => void;
  onFileClose: (filePath: string) => void;
  projectId?: string;
}
const CodeArea = ({
  openFiles,
  activeFile,
  onFileSelect,
  onFileClose,
  projectId,
}: CodeAreaProps) => {
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [loadingFiles, setLoadingFiles] = useState<Set<string>>(new Set());
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());

  const handleFileContent = useCallback((data: { filePath: string; content: string }) => {
    setFileContents((prev) => ({ ...prev, [data.filePath]: data.content }));
    setLoadingFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(data.filePath);
      return newSet;
    });
  }, []);

  const handleFileSaved = useCallback((data: { filePath: string; success: boolean }) => {
    if (data.success) {
      setUnsavedChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.filePath);
        return newSet;
      });
    }
  }, []);

  const { requestFileContent, saveFileContent } = useSocket({
    onFileContent: handleFileContent,
    onFileSaved: handleFileSaved,
  });

  const loadFileContent = (filePath: string) => {
    if (fileContents[filePath] || loadingFiles.has(filePath)) {
      return;
    }

    setLoadingFiles((prev) => new Set(prev).add(filePath));
    requestFileContent(filePath, projectId);
  };

  const handleEditorChange = (value: string | undefined, filePath: string) => {
    if (value !== undefined) {
      setFileContents((prev) => ({ ...prev, [filePath]: value }));
      setUnsavedChanges((prev) => new Set(prev).add(filePath));
    }
  };

  const handleSave = (filePath: string) => {
    const content = fileContents[filePath];
    if (content !== undefined) {
      saveFileContent(filePath, content, projectId);
    }
  };

  useEffect(() => {
    openFiles.forEach((filePath) => {
      if (!fileContents[filePath] && !loadingFiles.has(filePath)) {
        loadFileContent(filePath);
      }
    });
  }, [openFiles, fileContents, loadingFiles]);

  if (openFiles.length === 0) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-[#171717]">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-[#30363d] bg-gray-50 dark:bg-[#0A0A0A]">
          <span className="text-sm text-gray-600 dark:text-[#7d8590]">No tabs open</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-xl font-medium text-gray-800 dark:text-[#e6edf3]">
              Welcome to Terminax
            </div>
            <div className="text-sm text-gray-600 dark:text-[#7d8590] max-w-md">
              Your workspace is ready for development.
            </div>
          </div>
        </div>
      </div>
    );
  }
  console.log(activeFile, openFiles);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#171717]">
      <Tabs
        value={activeFile || openFiles[0]}
        onValueChange={onFileSelect}
        className="h-full flex flex-col">
        <div className="border-b border-gray-200 dark:border-[#30363d] bg-gray-50 dark:bg-[#0A0A0A]">
          <TabsList className="h-auto p-0 bg-transparent justify-start rounded-none w-full">
            {openFiles.map((filePath) => (
              <div key={filePath} className="relative group">
                <TabsTrigger
                  value={filePath}
                  className="relative pr-8 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none text-gray-700 dark:text-[#e6edf3] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-sm">{filePath.split("/").pop()}</span>
                </TabsTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-[#30363d] text-gray-600 dark:text-[#e6edf3]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileClose(filePath);
                  }}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          {openFiles.map((filePath) => (
            <TabsContent key={filePath} value={filePath} className="h-full m-0 p-0">
              <div className="h-full">
                <Editor
                  height="100%"
                  width="100%"
                  path={filePath}
                  theme="vs-dark"
                  value={fileContents[filePath] || "// Loading..."}
                  onChange={(value) => handleEditorChange(value, filePath)}
                  options={{
                    minimap: { enabled: false },
                    readOnly: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 10, bottom: 10 },
                    lineNumbers: "on",
                    suggest: {
                      showIcons: true,
                    },
                    quickSuggestions: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    autoIndent: "full",
                  }}
                  onMount={(editor, monaco) => {
                    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                      handleSave(filePath);
                    });
                  }}
                />
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default CodeArea;

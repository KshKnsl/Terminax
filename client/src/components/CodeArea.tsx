import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface CodeAreaProps {
  openFiles: string[];
  activeFile: string | null;
  onFileSelect: (filePath: string) => void;
  onFileClose: (filePath: string) => void;
}

const CodeArea = ({ openFiles, activeFile, onFileSelect, onFileClose }: CodeAreaProps) => {
  if (openFiles.length === 0) {
    return (
      <div className="h-full flex flex-col bg-[#171717] dark:bg-black">
        <div className="flex items-center justify-between p-3 border-b border-[#3c3c3c] dark:border-[#30363d] bg-black dark:bg-[#0A0A0A]">
          <span className="text-sm text-[#cccccc] dark:text-[#7d8590]">No tabs open</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-xl font-medium text-[#cccccc] dark:text-[#e6edf3]">
              Welcome to Terminax
            </div>
            <div className="text-sm text-[#969696] dark:text-[#7d8590] max-w-md">
              Double-click any file from the explorer to start coding. Your workspace is ready for
              development.
            </div>
            <div className="text-xs text-[#6f6f6f] dark:text-[#656d76] bg-black dark:bg-[#0A0A0A] px-3 py-2 rounded-md border border-[#3c3c3c] dark:border-[#30363d]">
              💡 Tip: Use the file explorer on the left to navigate your project
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#171717] dark:bg-black">
      <Tabs
        value={activeFile || openFiles[0]}
        onValueChange={onFileSelect}
        className="h-full flex flex-col">
        <div className="border-b border-[#3c3c3c] dark:border-[#30363d] bg-black dark:bg-[#0A0A0A]">
          <TabsList className="h-auto p-0 bg-transparent justify-start rounded-none w-full">
            {openFiles.map((filePath) => (
              <div key={filePath} className="relative group">
                <TabsTrigger
                  value={filePath}
                  className="relative pr-8 data-[state=active]:bg-[#171717] dark:data-[state=active]:bg-black data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none text-[#cccccc] dark:text-[#e6edf3] hover:bg-[#2a2a2a] dark:hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-sm">{filePath.split("/").pop()}</span>
                </TabsTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3c3c3c] dark:hover:bg-[#30363d] text-[#cccccc] dark:text-[#e6edf3]"
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
            <TabsContent key={filePath} value={filePath} className="h-full m-0 p-6">
              <div className="h-full flex items-center justify-center border-2 border-dashed border-[#3c3c3c] dark:border-[#30363d] rounded-lg bg-[#252526] dark:bg-[#161b22]">
                <div className="text-center space-y-4">
                  <div className="text-lg font-medium text-[#cccccc] dark:text-[#e6edf3]">
                    {filePath.split("/").pop()}
                  </div>
                  <div className="text-sm text-[#969696] dark:text-[#7d8590]">
                    File content will be displayed here
                  </div>
                  <div className="text-xs text-[#6f6f6f] dark:text-[#656d76] font-mono bg-[#1e1e1e] dark:bg-[#0d1117] px-3 py-2 rounded border border-[#3c3c3c] dark:border-[#30363d]">
                    {filePath}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-[#6f6f6f] dark:text-[#656d76]">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Ready for development
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default CodeArea;

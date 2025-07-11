import TreeSt from "../TreeDataStructure";
import { Tree, Folder, File } from "./ui/file-tree";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface FileTreeAreaProps {
  patharray: string[];
  onFileOpen: (filePath: string) => void;
  onFileSelect: (filePath: string) => void;
  onReloadFiles?: () => void;
}
type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

interface RecurComponentProps {
  node: TreeNode;
  onFileOpen: (filePath: string) => void;
  onFileSelect: (filePath: string) => void;
  patharray: string[];
  flatFileList: string[];
  expandedFolders: Set<string>;
  setExpandedFolders: (folders: Set<string>) => void;
}

function RecurComponent({
  node,
  onFileOpen,
  onFileSelect,
  patharray,
  flatFileList,
  expandedFolders,
  setExpandedFolders,
}: RecurComponentProps) {
  const isFile = !node.children || node.children.length === 0;

  const handleFileClick = () => {
    if (isFile && node.id) {
      onFileSelect(node.id);
    }
  };

  const handleFileRightClick = (e: React.MouseEvent) => {
    if (isFile && node.id) {
      e.preventDefault();
      onFileOpen(node.id);
    }
  };

  return (
    <>
      {node?.children && node.children.length > 0 ? (
        <Folder
          element={node.label}
          value={node.id}
          className="hover:!bg-gray-100 dark:hover:!bg-purple-900/30 transition-all duration-200 rounded-md px-2 py-1">
          {node.children &&
            node.children.map((child) => (
              <RecurComponent
                key={child.id}
                node={child}
                onFileOpen={onFileOpen}
                onFileSelect={onFileSelect}
                patharray={patharray}
                flatFileList={flatFileList}
                expandedFolders={expandedFolders}
                setExpandedFolders={setExpandedFolders}
              />
            ))}
        </Folder>
      ) : (
        <File
          value={node.id}
          onClick={handleFileClick}
          onContextMenu={handleFileRightClick}
          className="hover:!bg-gray-100 dark:hover:!bg-purple-900/30 transition-all duration-200 rounded-md px-2 py-1 w-full">
          <span className="text-sm text-gray-700 dark:text-[#e6edf3]">{node.label}</span>
        </File>
      )}
    </>
  );
}

const FileTreeArea = ({ patharray, onFileOpen, onFileSelect, onReloadFiles }: FileTreeAreaProps) => {
  const tree = new TreeSt(patharray);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newFileName, setNewFileName] = useState("");
  const [deleteFilePath, setDeleteFilePath] = useState("");
  const { socket } = useSocket();

  const flatFileList = patharray.filter((path) => {
    const parts = path.split("/");
    const fileName = parts[parts.length - 1];
    return fileName.includes(".");
  });

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    if (socket) {
      socket.emit("create-file", { filePath: newFileName });
      socket.once("file-create-response", (res: any) => {
        if (res.success && onReloadFiles) {
          onReloadFiles();
        }
      });
    }
    setNewFileName("");
  };

  const handleDeleteFile = () => {
    if (!deleteFilePath.trim()) return;
    if (socket) {
      socket.emit("delete-file", { filePath: deleteFilePath });
      socket.once("file-delete-response", (res: any) => {
        if (res.success && onReloadFiles) {
          onReloadFiles();
        }
      });
    }
    setDeleteFilePath("");
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0A0A0A]">
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-[#30363d]">
        <input
          type="text"
          value={newFileName}
          onChange={e => setNewFileName(e.target.value)}
          placeholder="New file name..."
          className="border rounded px-2 py-1 text-sm"
        />
        <button
          className="bg-purple-600 text-white px-3 py-1 rounded text-xs"
          onClick={handleCreateFile}
        >
          Create File
        </button>
        <input
          type="text"
          value={deleteFilePath}
          onChange={e => setDeleteFilePath(e.target.value)}
          placeholder="File path to delete..."
          className="border rounded px-2 py-1 text-sm ml-2"
        />
        <button
          className="bg-red-600 text-white px-3 py-1 rounded text-xs"
          onClick={handleDeleteFile}
        >
          Delete File
        </button>
      </div>
      {/* File Tree */}
      <div className="flex-1 min-h-0">
        <Tree
          className="w-full h-full"
          initialExpandedItems={Array.from(expandedFolders)}
          key={Array.from(expandedFolders).join(",")}>
          <RecurComponent
            node={tree.root as unknown as TreeNode}
            onFileOpen={onFileOpen}
            onFileSelect={onFileSelect}
            patharray={patharray}
            flatFileList={flatFileList}
            expandedFolders={expandedFolders}
            setExpandedFolders={setExpandedFolders}
          />
        </Tree>
      </div>
    </div>
  );
};

export default FileTreeArea;

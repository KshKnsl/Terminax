import TreeSt from "../TreeDataStructure";
import { Tree, Folder, File } from "./ui/file-tree";
import { useState } from "react";

interface FileTreeAreaProps {
  patharray: string[];
  onFileOpen: (filePath: string) => void;
  onFileSelect: (filePath: string) => void;
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
          className="hover:!bg-purple-100 dark:hover:!bg-purple-900/30 transition-all duration-200 rounded-md px-2 py-1">
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
          className="hover:!bg-purple-100 dark:hover:!bg-purple-900/30 transition-all duration-200 rounded-md px-2 py-1 w-full">
          <span className="text-sm text-foreground">{node.label}</span>
        </File>
      )}
    </>
  );
}

const FileTreeArea = ({ patharray, onFileOpen, onFileSelect }: FileTreeAreaProps) => {
  const tree = new TreeSt(patharray);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const flatFileList = patharray.filter((path) => {
    const parts = path.split("/");
    const fileName = parts[parts.length - 1];
    return fileName.includes(".");
  });

  return (
    <div className="h-full flex flex-col bg-black dark:bg-[#0A0A0A]">
      {/* File Tree */}
      <div className="flex-1 overflow-auto p-1">
        <Tree
          className="w-full"
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

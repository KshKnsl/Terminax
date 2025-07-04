import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../components/ui/Loading";
import FileTreeArea from "../components/FileTreeArea";
import CodeArea from "../components/CodeArea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../components/ui/resizable";
import { Button } from "../components/ui/button";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [filesData, setFilesData] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const handleFileOpen = (filePath: string) => {
    if (!openFiles.includes(filePath)) {
      setOpenFiles((prev) => [...prev, filePath]);
    }
    setActiveFile(filePath);
  };

  const handleFileClose = (filePath: string) => {
    setOpenFiles((prev) => {
      const newOpenFiles = prev.filter((f) => f !== filePath);
      if (activeFile === filePath && newOpenFiles.length > 0) {
        setActiveFile(newOpenFiles[newOpenFiles.length - 1]);
      } else if (activeFile === filePath) {
        setActiveFile(null);
      }
      return newOpenFiles;
    });
  };

  const handleFileSelect = (filePath: string) => {
    if (openFiles.includes(filePath)) {
      setActiveFile(filePath);
    } else {
      if (openFiles.length === 0) {
        setOpenFiles([filePath]);
      } else {
        setOpenFiles((prev) => {
          const newFiles = [...prev];
          const activeIndex = activeFile ? newFiles.indexOf(activeFile) : 0;
          newFiles[activeIndex] = filePath;
          return newFiles;
        });
      }
      setActiveFile(filePath);
    }
  };

  const fetchProjectFiles = async () => {
    if (!id) return;
    try {
      // const response = await fetch(`${SERVER_URL}/project/getAllFiles/${id}`, {
      //   credentials: "include",
      // });
      // const data = await response.json();
      const data = {
        success: true,
        message: "Project files fetched successfully",
        localPath: {
          local: "D:\\Desktop\\Terminax\\server\\fetched_active_projects\\KshKnsl.github.io",
          patharray: [
            "KshKnsl.github.io/CNAME",
            "KshKnsl.github.io/app/favicon.ico",
            "KshKnsl.github.io/app/globals.css",
            "KshKnsl.github.io/app/page.tsx",
            "KshKnsl.github.io/app/projects/layout.tsx",
            "KshKnsl.github.io/app/projects/page.tsx",
            "KshKnsl.github.io/components.json",
            "KshKnsl.github.io/components/ai-chat.tsx",
            "KshKnsl.github.io/components/browser-navbar.tsx",
            "KshKnsl.github.io/components/coding-profiles.tsx",
            "KshKnsl.github.io/components/contact-form.tsx",
            "KshKnsl.github.io/components/contact-icons.tsx",
            "KshKnsl.github.io/components/count-up.tsx",
            "KshKnsl.github.io/components/education-timeline.tsx",
            "KshKnsl.github.io/components/github-profile.tsx",
            "KshKnsl.github.io/components/hero-section.tsx",
            "KshKnsl.github.io/components/loading-screen.tsx",
            "KshKnsl.github.io/components/project-grid.tsx",
            "KshKnsl.github.io/components/tech-stack-grid.tsx",
            "KshKnsl.github.io/components/terminal-emulator.tsx",
            "KshKnsl.github.io/components/terminal-input.tsx",
            "KshKnsl.github.io/components/theme-toggle.tsx",
            "KshKnsl.github.io/components/ui/background-lines.tsx",
            "KshKnsl.github.io/components/ui/lamp.tsx",
            "KshKnsl.github.io/components/ui/link-preview.tsx",
            "KshKnsl.github.io/components/visitor-countor.tsx",
            "KshKnsl.github.io/context/theme-provider.tsx",
            "KshKnsl.github.io/eslint.config.mjs",
            "KshKnsl.github.io/lib/utils.ts",
            "KshKnsl.github.io/middleware.ts",
            "KshKnsl.github.io/next.config.ts",
            "KshKnsl.github.io/package-lock.json",
            "KshKnsl.github.io/package.json",
            "KshKnsl.github.io/pages/_document.tsx",
            "KshKnsl.github.io/postcss.config.mjs",
            "KshKnsl.github.io/public/CursorSvgs/Default.svg",
            "KshKnsl.github.io/public/CursorSvgs/Hand.svg",
            "KshKnsl.github.io/public/assets/MyImage.png",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/Ejs.png",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/Sass.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/bootstrap.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/bun.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/c.png",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/cpp.png",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/docker.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/expressjs.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/figma.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/git.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/github-actions.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/github.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/gsap.webp",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/java.png",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/javascript.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/langchain-color.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/markdown.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/mongodb.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/nextjs.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/nodejs.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/npm.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/openai.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/postgres.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/postman.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/puppeteer.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/python.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/react.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/redis.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/tailwindcss.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/typescript.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/vercel.svg",
            "KshKnsl.github.io/public/assets/TechStacks-Logo/vs-code.png",
            "KshKnsl.github.io/tailwind.config.ts",
            "KshKnsl.github.io/tsconfig.json",
            "KshKnsl.github.io/utils/messages.ts",
            "KshKnsl.github.io/utils/scroll-utils.ts",
          ],
        },
        project: {
          _id: "68666db2a7e28c7a8384f28e",
          name: "KshKnsl.github.io",
          repoid: "950095435",
          logo_url: "https://avatars.githubusercontent.com/u/136092388?v=4",
          repo_url: "https://github.com/KshKnsl/KshKnsl.github.io",
          repo_name: "KshKnsl/KshKnsl.github.io",
          branch_url: "https://api.github.com/repos/KshKnsl/KshKnsl.github.io/branches{/branch}",
          description: "",
          languages_url: "https://api.github.com/repos/KshKnsl/KshKnsl.github.io/languages",
          selected_branch: "main",
          commithistory_url: "https://api.github.com/repos/KshKnsl/KshKnsl.github.io/commits",
          lastDeploymentDate: null,
          deploymentLink: "FXXUB",
          ownerId: "68649a366a59a58dbf041864",
          codestorageUrl:
            "https://terminax.s3.filebase.com/68649a366a59a58dbf041864/KshKnsl.github.io/",
          createdAt: "2025-07-03T11:46:58.336Z",
          updatedAt: "2025-07-03T11:46:58.336Z",
          __v: 0,
        },
      };
      setFilesData(data);
    } catch (err) {
      setError("Failed to fetch project files");
    }
  };
  useEffect(() => {
    const autoFetch = async () => {
      await fetchProjectFiles();
      setInitialLoading(false);
    };
    autoFetch();
  }, [id]);

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className="bg-destructive/15 text-destructive px-3 py-1 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-hidden bg-black dark:bg-[#0A0A0A]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
            <div className="h-full bg-black dark:bg-[#0A0A0A] border-r border-[#3c3c3c] dark:border-[#30363d] flex flex-col">
              <div className="p-3 border-b border-[#3c3c3c] dark:border-[#30363d] bg-[#171717] dark:bg-[#0A0A0A] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#cccccc] dark:text-[#e6edf3] uppercase tracking-wide">
                  Explorer
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/project/info/${id}`)}
                  className="text-xs text-[#969696] hover:text-[#cccccc] dark:text-[#7d8590] dark:hover:text-[#e6edf3] hover:bg-[#2a2a2a] dark:hover:bg-[#21262d] px-2 py-1 h-6"
                >
                  View Details
                </Button>
              </div>
              <div className="flex-1">
                {filesData && filesData.localPath && filesData.localPath.patharray ? (
                  <FileTreeArea
                    patharray={filesData.localPath.patharray}
                    onFileOpen={handleFileOpen}
                    onFileSelect={handleFileSelect}
                  />
                ) : (
                  <div className="p-4 text-[#969696] dark:text-[#7d8590]">No files available</div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={75} minSize={50}>
            <div className="h-full bg-[#171717] dark:bg-black">
              <CodeArea
                openFiles={openFiles}
                activeFile={activeFile}
                onFileSelect={handleFileSelect}
                onFileClose={handleFileClose}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Project;

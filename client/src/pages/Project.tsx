import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../components/ui/Loading";
import FileTreeArea from "../components/FileTreeArea";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const [filesData, setFilesData] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>("");

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Project Page</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Files Data */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Project Files (/getAllFiles)</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
            <pre className="text-sm whitespace-pre-wrap">
              {filesData ? JSON.stringify(filesData, null, 2) : "Loading project files..."}
            </pre>
          </div>
        </div>
        {filesData && filesData.localPath && filesData.localPath.patharray && (
          <FileTreeArea patharray={filesData.localPath.patharray} />
        )}
      </div>
    </div>
  );
};

export default Project;

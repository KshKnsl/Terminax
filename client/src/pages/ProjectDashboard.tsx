import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, GitCommit } from "lucide-react";
import Loading from "@/components/ui/Loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChartPieDonutText } from "@/components/ui/donut-pie-chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProjectSettingsForm from "@/components/ProjectSettingsForm";

export interface ProjectData {
  _id: string;
  name: string;
  repoid?: string;
  logo_url: string;
  repo_url?: string;
  repo_name?: string;
  branch_url?: string;
  description?: string;
  languages_url?: string;
  selected_branch?: string;
  commithistory_url?: string;
  lastDeploymentDate?: string;
  deploymentLink?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  template: string;
  codestorageUrl?: string;
  command: string;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const ProjectDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [languagesData, setLanguagesData] = useState<any>(null);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [languagesError, setLanguagesError] = useState("");
  const [commitsOpen, setCommitsOpen] = useState(false);
  const [commitsData, setCommitsData] = useState<any>(null);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [commitsError, setCommitsError] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState("");
  // Fetch branches from backend
  const fetchBranches = async () => {
    if (!project?.branch_url) return;
    setBranchesLoading(true);
    setBranchesError("");
    setBranches([]);
    try {
      const res = await fetch(
        `${SERVER_URL}/github/branches?branchUrl=${encodeURIComponent(project.branch_url)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.branches)) {
        setBranches(data.branches.map((b: any) => b.name));
      } else setBranchesError("Failed to fetch branches");
    } catch (err) {
      setBranchesError("Failed to fetch branches");
    } finally {
      setBranchesLoading(false);
    }
  };
  // Fetch languages from backend
  const fetchLanguages = async () => {
    if (!project?.languages_url) return;
    setLanguagesLoading(true);
    setLanguagesError("");
    setLanguagesData(null);
    try {
      const res = await fetch(
        `${SERVER_URL}/github/languages?languages_url=${encodeURIComponent(project.languages_url)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) setLanguagesData(data.branches || data.languages || data);
      else setLanguagesError("Failed to fetch languages");
    } catch (err) {
      setLanguagesError("Failed to fetch languages");
    } finally {
      setLanguagesLoading(false);
    }
  };

  // Fetch commits from backend
  const fetchCommits = async () => {
    if (!project?.commithistory_url) return;
    setCommitsLoading(true);
    setCommitsError("");
    setCommitsData(null);
    try {
      const res = await fetch(
        `${SERVER_URL}/github/commits?commithistory_url=${encodeURIComponent(project.commithistory_url)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) setCommitsData(data.branches);
      else setCommitsError("Failed to fetch commits");
    } catch (err) {
      setCommitsError("Failed to fetch commits");
    } finally {
      setCommitsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetch(`${SERVER_URL}/project/get/${id}`, { credentials: "include" });
        const json = await data.json();
        if (json.success && json.project) {
          setProject({ ...json.project, template: json.project.template ?? "" });
        } else {
          setError("Project not found");
        }
      } catch (err) {
        setError("Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  useEffect(() => {
    if (project?.branch_url) fetchBranches();
  }, [project?.branch_url]);

  useEffect(() => {
    if (project?.languages_url) fetchLanguages();
  }, [project?.languages_url]);

  if (loading) {
    return <Loading />;
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p>{error || "Project not found"}</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/40 dark:data-[state=active]:text-purple-200 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-4 py-2 text-base font-semibold whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/40 dark:data-[state=active]:text-purple-200 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-4 py-2 text-base font-semibold whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm">
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-lg">
          {/* Project Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center overflow-hidden">
              {project.logo_url ? (
                <img src={project.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-purple-500">{project.name[0]}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {project.name}
              </h1>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Project ID: <span className="font-mono">{project._id}</span>
              </div>
              {project.repoid && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Repo ID: <span className="font-mono">{project.repoid}</span>
                </div>
              )}
              {project.repo_url && project.repo_name && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm">
                  {project.repo_name}
                </a>
              )}
              {project.selected_branch && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Branch:
                  <span className="font-medium text-purple-500">{project.selected_branch}</span>
                </div>
              )}
              {project.template && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Template: <span className="font-medium text-purple-500">{project.template}</span>
                </div>
              )}
            </div>
          </div>
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
              {project.description || "No description provided."}
            </p>
            <div className="mt-4">
              <span className="font-semibold text-gray-800 dark:text-gray-100">Run Command:</span>
              <span className="ml-2 font-mono text-xs bg-gray-100 dark:bg-[#0A0A0A] px-2 py-1 rounded">
                {project.command}
              </span>
            </div>
          </div>
          {/* Key Info and Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left column: Dates, Commits, Deployment, Branches */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Created At</h3>
                <span className="text-xs text-gray-500">
                  {new Date(project.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Updated At</h3>
                <span className="text-xs text-gray-500">
                  {new Date(project.updatedAt).toLocaleString()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Commits</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Dialog open={commitsOpen} onOpenChange={setCommitsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={fetchCommits}
                          title="Show Commits">
                          <GitCommit className="w-4 h-4 text-purple-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Commits Data</DialogTitle>
                        </DialogHeader>
                        {commitsLoading ? (
                          <Loading />
                        ) : commitsError ? (
                          <div className="text-center text-red-500">{commitsError}</div>
                        ) : (
                          <pre className="whitespace-pre-wrap break-all text-xs max-h-96 overflow-auto">
                            {JSON.stringify(commitsData, null, 2)}
                          </pre>
                        )}
                      </DialogContent>
                    </Dialog>
                    {/* Commit stats */}
                  </div>
                  {commitsData && Array.isArray(commitsData) && commitsData.length > 0 && (
                    <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                      <div>
                        Total commits: <span className="font-semibold">{commitsData.length}</span>
                      </div>
                      <div>
                        Unique authors:
                        <span className="font-semibold">
                          {
                            Array.from(
                              new Set(
                                commitsData.map(
                                  (c: any) => c.commit?.author?.name || c.author?.login || "Unknown"
                                )
                              )
                            ).length
                          }
                        </span>
                      </div>
                      <div>
                        Latest commit:
                        <span className="font-semibold">
                          {new Date(
                            commitsData[0].commit?.author?.date ||
                              commitsData[0].commit?.committer?.date
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Deployment Link Section */}
              {project.deploymentLink && (
                <div>
                  <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                    Deployment Link
                  </h3>
                  {(() => {
                    const isHttp = project.deploymentLink!.startsWith("http");
                    const baseUrl = window.location.origin;
                    const link = isHttp
                      ? project.deploymentLink
                      : `${baseUrl}${project.deploymentLink!.startsWith("/") ? "" : "/"}${project.deploymentLink}`;
                    return (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline break-all text-xs">
                        {link}
                      </a>
                    );
                  })()}
                </div>
              )}
              {/* Branches Section */}
              {project.branch_url && branches.length > 0 && !branchesLoading && !branchesError && (
                <div>
                  <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Branches</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {branches.map((branch) => (
                      <span
                        key={branch}
                        className={
                          branch === project.selected_branch
                            ? "px-2 py-1 rounded bg-purple-600 text-white text-xs font-semibold shadow"
                            : "px-2 py-1 rounded bg-gray-200 dark:bg-[#0A0A0A] text-xs text-gray-700 dark:text-gray-300"
                        }>
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Right column: Languages chart spanning all rows */}
            {project.languages_url &&
              languagesData &&
              typeof languagesData === "object" &&
              Object.keys(languagesData).length > 0 && (
                <div className="flex flex-col justify-between h-full">
                  <div className="w-full max-w-md mx-auto">
                    <h2 className="text-lg font-semibold mb-2">Languages</h2>
                    {languagesLoading ? (
                      <div className="text-xs text-gray-400">Loading languages...</div>
                    ) : languagesError ? (
                      <div className="text-xs text-red-500">{languagesError}</div>
                    ) : (
                      <ChartPieDonutText
                        chartData={Object.entries(languagesData).map(([lang, value]) => ({
                          browser: lang,
                          visitors: Number(value),
                          fill: undefined,
                        }))}
                        title="Languages"
                        description="Project language breakdown"
                        valueLabel="Bytes"
                      />
                    )}
                  </div>
                </div>
              )}
          </div>
        </TabsContent>
        <TabsContent value="settings" className="text-lg">
          <ProjectSettingsForm
            project={project}
            onProjectUpdate={(p) => setProject({ ...project, ...p })}
          />
          {project.codestorageUrl && (
            <div className="mt-6">
              <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                Code Storage URL
              </h3>
              <a
                href={project.codestorageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all text-xs">
                {project.codestorageUrl}
              </a>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDashboard;

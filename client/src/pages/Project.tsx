import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, GitCommit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChartPieDonutText } from "@/components/ui/donut-pie-chart";

interface ProjectData {
  _id: string;
  name: string;
  repoid: string;
  logo_url: string;
  repo_url: string;
  repo_name: string;
  branch_url: string;
  description?: string;
  languages_url: string;
  selected_branch: string;
  commithistory_url: string;
  lastDeploymentDate?: string;
  deploymentLink?: string;
  createdAt: string;
  updatedAt: string;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const Project = () => {
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
        const res = await fetch(`${SERVER_URL}/project/get/${id}`, { credentials: "include" });
        const data = await res.json();
        if (data.success && data.project) {
          setProject(data.project);
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        Loading project...
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{project.name}</h1>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Project ID: <span className="font-mono">{project._id}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Repo ID: <span className="font-mono">{project.repoid}</span>
          </div>
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline text-sm">
            {project.repo_name}
          </a>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Branch: <span className="font-medium text-purple-500">{project.selected_branch}</span>
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
          {project.description || "No description provided."}
        </p>
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
                    <Button size="icon" variant="ghost" onClick={fetchCommits} title="Show Commits">
                      <GitCommit className="w-4 h-4 text-purple-500" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Commits Data</DialogTitle>
                    </DialogHeader>
                    {commitsLoading ? (
                      <div className="text-center text-gray-400">Loading...</div>
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
                    Unique authors:{" "}
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
                    Latest commit:{" "}
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
          <div>
            <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Deployment Link</h3>
            {project.deploymentLink ? (
              <a
                href={project.deploymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline break-all text-xs">
                {project.deploymentLink}
              </a>
            ) : (
              <span className="text-xs text-gray-400">No deployment link</span>
            )}
          </div>
          {/* Branches Section */}
          <div>
            <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Branches</h3>
            {branchesLoading ? (
              <div className="text-xs text-gray-400">Loading branches...</div>
            ) : branchesError ? (
              <div className="text-xs text-red-500">{branchesError}</div>
            ) : branches.length > 0 ? (
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
            ) : (
              <div className="text-xs text-gray-400">No branches found.</div>
            )}
          </div>
        </div>
        {/* Right column: Languages chart spanning all rows */}
        <div className="flex flex-col justify-between h-full">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">Languages</h2>
            {languagesLoading ? (
              <div className="text-xs text-gray-400">Loading languages...</div>
            ) : languagesError ? (
              <div className="text-xs text-red-500">{languagesError}</div>
            ) : languagesData &&
              typeof languagesData === "object" &&
              Object.keys(languagesData).length > 0 ? (
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
            ) : (
              <div className="text-xs text-gray-400">No language data found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;

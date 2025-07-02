import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Terminal, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import GithubRepoSelector from "@/components/GithubRepoSelector";
import NewProjectForm from "@/components/NewProjectForm";
import Setting from "@/components/Setting";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Application {
  _id: string;
  id: string;
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
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
  languageUrl: string;
  default_branch: string;
  branches_url: string;
  url: string;
  avatar_url?: string;
  commitHistory: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"apps" | "settings">("apps");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
  const navigate = useNavigate();

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepo(repo);
  };

  const handleProjectSubmit = async () => {
    setIsProjectDialogOpen(false);
    setSelectedRepo(null);
    fetchApplications();
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await fetch(`${SERVER_URL}/project/getall`, { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setApplications(data.projects);
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="relative bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={0.8}
            className="absolute inset-0 w-full h-full opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-8 py-12 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-purple-500">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
                Manage your terminal applications and monitor active sessions
              </p>
            </div>
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Start a new project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedRepo ? "Configure Your Project" : "Select a Repository"}
                  </DialogTitle>
                </DialogHeader>
                {selectedRepo ? (
                  <NewProjectForm
                    repository={selectedRepo}
                    onSubmit={handleProjectSubmit}
                    onBack={() => setSelectedRepo(null)}
                  />
                ) : (
                  <GithubRepoSelector onSelect={handleRepoSelect} />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="mb-8 bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]">
            <TabsTrigger
              value="apps"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-400 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-4 py-2 text-base font-semibold whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm">
              <Terminal className="w-4 h-4 mr-2" /> Applications
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-400 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-4 py-2 text-base font-semibold whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="apps" className="text-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Applications
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingApps ? (
                  <div className="col-span-full text-center text-gray-400">Loading...</div>
                ) : applications.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400">
                    No applications found.
                  </div>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer"
                      onClick={() => navigate(`/project/${app._id}`)}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                            {app.logo_url ? (
                              <img
                                src={app.logo_url}
                                alt="Logo"
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {app.name}
                            </h3>
                            {app.selected_branch && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                {app.selected_branch}
                              </span>
                            )}
                            {app.template && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                {app.template}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/project/info/${app._id}`);
                          }}
                          aria-label="Project Settings"
                        >
                          <Info className="w-5 h-5" /> {"&"}
                          <Settings className="w-5 h-5" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {app.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {app.repo_name || app.template}
                        </div>
                        {app.deploymentLink && (
                          <div className="text-xs text-green-600 truncate mt-1">
                            Deploy: {app.deploymentLink}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="text-lg">
            <Setting />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

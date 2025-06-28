import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Terminal, Settings, Grid3X3, List, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import GithubRepoSelector from "@/components/GithubRepoSelector";
import NewProjectForm from "@/components/NewProjectForm";
import Setting from "@/components/Setting";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Application {
  _id: string;
  id: string;
  name: string;
  repo_name: string;
  repo_url: string;
  logo_url: string;
  description?: string;
  selected_branch: string;
  languages_url: string;
  commithistory_url: string;
  createdAt: string;
  updatedAt: string;
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-500">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your terminal applications and monitor active sessions
              </p>
            </div>
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Deploy New App
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
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: "apps", label: "Applications", icon: Terminal },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#0A0A0A]"
                )}>
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Applications Tab */}
        {activeTab === "apps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Applications</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-white dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "grid"
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}>
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "list"
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingApps ? (
                  <div className="col-span-full text-center text-gray-400">Loading...</div>
                ) : applications.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400">No applications found.</div>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer"
                      onClick={() => navigate(`/project/${app._id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                            {app.logo_url ? (
                              <img src={app.logo_url} alt="Logo" className="w-8 h-8 object-cover rounded" />
                            ) : (
                              <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {app.name}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                              {app.selected_branch}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {app.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {app.repo_name}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loadingApps ? (
                    <div className="p-6 text-center text-gray-400">Loading...</div>
                  ) : applications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">No applications found.</div>
                  ) : (
                    applications.map((app) => (
                      <div
                        key={app._id}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-[#171717]/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/project/${app._id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                              {app.logo_url ? (
                                <img src={app.logo_url} alt="Logo" className="w-8 h-8 object-cover rounded" />
                              ) : (
                                <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {app.name}
                                </h3>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                  {app.selected_branch}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {app.description}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {app.repo_name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && <Setting />}
      </div>
    </div>
  );
}

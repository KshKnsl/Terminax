import React, { useState, useEffect } from "react";
import { Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/Loading";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

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

interface GithubRepoSelectorProps {
  onSelect?: (repo: Repository) => void;
}

const GithubRepoSelector: React.FC<GithubRepoSelectorProps> = ({ onSelect }) => {
  const [repoList, setRepoList] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);

  const { user } = useAuth();
  const githubConnected = Boolean(user?.accessToken);

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepoId(repo.id);
    onSelect?.(repo);
  };

  // Load repositories when component mounts
  useEffect(() => {
    if (githubConnected) {
      loadRepositories();
    } else {
      setLoading(false);
    }
  }, [githubConnected]);

  const loadRepositories = async () => {
    setLoading(true);
    setError(null);

    const response = await fetch(`${SERVER_URL}/github/repositories`, {
      credentials: "include",
    });

    if (!response.ok) {
      setError("Failed to fetch repositories");
      setLoading(false);
      return;
    }

    const data = await response.json();

    if (!data.success) {
      setError(data.error || "Failed to fetch repositories");
      setLoading(false);
      return;
    }

    const repoData = data.repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      description: repo.description,
      html_url: repo.html_url,
      languageUrl: repo.languages_url,
      default_branch: repo.default_branch,
      branches_url: repo.branches_url.replace(/\/\{\/?branch\}$/, ""),
      url: repo.url,
      avatar_url: repo.owner.avatar_url,
      commitHistory: repo.url + "/commits",
    }));

    setRepoList(repoData);
    setLoading(false);
  };

  const fetchPublicRepo = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const repoRegex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = url.match(repoRegex);

      if (!match) {
        setError("Invalid GitHub repository URL");
        setLoading(false);
        return;
      }

      const [, owner, repo] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        setError("Repository not found or is private");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const repoData: Repository = {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        private: data.private,
        description: data.description,
        html_url: data.html_url,
        languageUrl: data.languages_url,
        default_branch: data.default_branch,
        branches_url: data.branches_url.replace(/\/\{\/?branch\}$/, ""),
        url: data.url,
        avatar_url: data.owner.avatar_url,
        commitHistory: data.url + "/commits",
      };

      // Add to the top of the list and select it
      setRepoList((prevList) => [repoData, ...prevList.filter((r) => r.id !== repoData.id)]);
      handleRepoSelect(repoData);
      setRepoUrl("");
    } catch (err) {
      setError("Failed to fetch repository details");
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repoList.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Always show the public repo fetch UI and blank project button
  // Only show repo list/search if githubConnected

  return (
    <div className="space-y-6">
      {/* Add public repo via URL */}
      <div className="space-y-2">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            placeholder="Paste GitHub repository URL..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full pl-4 pr-24 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
          <Button
            onClick={() => repoUrl && fetchPublicRepo(repoUrl)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            size="sm"
            disabled={!repoUrl}>
            Add Repo
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            onSelect?.({
              id: -1,
              name: "Blank Project",
              full_name: "blank",
              private: false,
              description: "Start a blank project",
              html_url: "",
              languageUrl: "",
              default_branch: "main",
              branches_url: "",
              url: "",
              avatar_url: undefined,
              commitHistory: "",
            })
          }>
          Start a Blank Project
        </Button>
      </div>

      {/* Show repo list/search only if connected */}
      {githubConnected ? (
        <>
          <input
            type="text"
            placeholder="Search your repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />

          {loading ? (
            <div className="p-4">
              <Loading />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
              {filteredRepos.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No repositories found
                </p>
              ) : (
                filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className={cn(
                      "relative p-4 rounded-lg border",
                      "transition-all duration-200",
                      "hover:bg-purple-50 dark:hover:bg-purple-900/10",
                      selectedRepoId === repo.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-500"
                        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0A]"
                    )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          {repo.avatar_url ? (
                            <img
                              src={repo.avatar_url}
                              alt="Repository owner"
                              className="w-8 h-8 rounded-lg"
                            />
                          ) : (
                            <Terminal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{repo.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {repo.full_name}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRepoSelect(repo)}
                        variant={selectedRepoId === repo.id ? "default" : "outline"}
                        className={cn(
                          "px-4 py-2 text-sm",
                          selectedRepoId === repo.id
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "hover:bg-purple-50 dark:hover:bg-purple-900/10"
                        )}>
                        {selectedRepoId === repo.id ? (
                          "Selected"
                        ) : (
                          <span className="flex items-center">
                            Select
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      ) : (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg text-yellow-700 dark:text-yellow-200 text-center">
          <p>Connect your GitHub account to browse and search your repositories.</p>
        </div>
      )}
    </div>
  );
};

export default GithubRepoSelector;

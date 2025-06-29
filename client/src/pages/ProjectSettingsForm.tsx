import React from "react";
import { Button } from "@/components/ui/button";

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

interface ProjectSettingsFormProps {
  project: ProjectData;
  onProjectUpdate: (p: ProjectData) => void;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const ProjectSettingsForm: React.FC<ProjectSettingsFormProps> = ({ project, onProjectUpdate }) => {
  const [name, setName] = React.useState(project.name);
  const [description, setDescription] = React.useState(project.description || "");
  const [logo_url, setLogoUrl] = React.useState(project.logo_url || "");
  const [selected_branch, setSelectedBranch] = React.useState(project.selected_branch);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  // Update project details (name, description, logo_url)
  const handleDetailsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${SERVER_URL}/project/updateDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: project._id, name, description, logo_url }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setSuccess("Project details updated.");
        onProjectUpdate(data.project);
      } else {
        setError(data.error || "Failed to update project details");
      }
    } catch (err) {
      setError("Failed to update project details");
    } finally {
      setSaving(false);
    }
  };

  // Update selected branch
  const handleBranchSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${SERVER_URL}/project/updateBranch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: project._id, selected_branch }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setSuccess("Branch updated.");
        onProjectUpdate(data.project);
      } else {
        setError(data.error || "Failed to update branch");
      }
    } catch (err) {
      setError("Failed to update branch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            Project Settings
          </h2>
          <form onSubmit={handleDetailsSave} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-[#0A0A0A] border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                  {logo_url ? (
                    <img src={logo_url} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-4xl text-gray-400 dark:text-gray-600">
                      🖼️
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  id="logo_url"
                  value={logo_url}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Paste logo image URL"
                  className="mt-2 w-60 px-3 py-2 border rounded text-xs bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                  disabled={saving}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 rounded px-3 py-2"
                  placeholder="Enter project name"
                  disabled={saving}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 rounded px-3 py-2"
                  rows={3}
                  placeholder="Enter project description"
                  disabled={saving}
                />
              </div>
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm dark:shadow-purple-900/20">
                  {saving ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}
          </form>
        </div>
      </div>
      {/* Branch selection */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            Branch Selection
          </h3>
          <form onSubmit={handleBranchSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Selected Branch
              </label>
              <input
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                value={selected_branch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={saving}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm dark:shadow-purple-900/20">
              {saving ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Update Branch"
              )}
            </Button>
            {(error || success) && (
              <div
                className={`mt-4 text-center text-sm ${error ? "text-red-500" : "text-green-600"}`}>
                {error || success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsForm;

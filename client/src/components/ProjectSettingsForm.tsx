import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { UserCircle2 } from "lucide-react";

interface ProjectData {
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
  template: string;
  codestorageUrl?: string;
}

interface ProjectSettingsFormProps {
  project: ProjectData;
  onProjectUpdate: (p: ProjectData) => void;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const ProjectSettingsForm: React.FC<ProjectSettingsFormProps> = ({ project, onProjectUpdate }) => {
  const [name, setName] = React.useState(project.name);
  const [description, setDescription] = React.useState(project.description || "");
  const [logoUrl, setLogoUrl] = React.useState(project.logo_url || "");
  const [logoPreview, setLogoPreview] = React.useState<string | null>(project.logo_url || null);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [selectedBranch, setSelectedBranch] = React.useState(project.selected_branch);
  const [branches, setBranches] = React.useState<string[]>([]);
  const [branchesLoading, setBranchesLoading] = React.useState(false);
  const [branchesError, setBranchesError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  const isTemplateProject = !project.repoid && !project.repo_url;

  React.useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(logoFile);
    } else if (logoUrl) {
      setLogoPreview(logoUrl);
    } else {
      setLogoPreview(null);
    }
  }, [logoFile, logoUrl]);

  React.useEffect(() => {
    setName(project.name);
    setDescription(project.description || "");
    setLogoUrl(project.logo_url || "");
    setLogoPreview(project.logo_url || null);
    setSelectedBranch(project.selected_branch);
  }, [project]);

  // Fetch branches from backend
  React.useEffect(() => {
    const fetchBranches = async () => {
      if (!project.branch_url) return;
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
    fetchBranches();
  }, [project.branch_url]);

  // Update project details (name, description, logo_url)
  const handleDetailsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      let uploadUrl = logoUrl;
      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);
        formData.append("projectId", project._id);
        const uploadRes = await fetch(`${SERVER_URL}/util/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          uploadUrl = uploadData.url;
        } else {
          throw new Error(uploadData.error || "Failed to upload logo");
        }
      }
      const res = await fetch(`${SERVER_URL}/project/updateDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: project._id, name, description, logo_url: uploadUrl }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setSuccess("Project details updated.");
        onProjectUpdate(data.project);
        setLogoFile(null); // reset file after successful upload
      } else {
        setError(data.error || "Failed to update project details");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update project details");
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
    const res = await fetch(`${SERVER_URL}/project/updateBranch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: project._id, selected_branch: selectedBranch }),
    });
    const data = await res.json();
    if (data.success && data.project) {
      setSuccess("Branch updated.");
      onProjectUpdate(data.project);
    } else {
      setError(data.error || "Failed to update branch");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    setDeleting(true);
    setError("");
    setSuccess("");
    const res = await fetch(`${SERVER_URL}/project/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ projId: project._id }),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess("Project deleted successfully.");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } else {
      setError(data.message || "Failed to delete project");
    }
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Project Details Card */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <UserCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Project Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Edit your project details</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Type: {isTemplateProject ? `Template (${project.template})` : "GitHub"}
              </span>
              {project.codestorageUrl && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Code Storage:{" "}
                  <a
                    href={project.codestorageUrl}
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer">
                    {project.codestorageUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleDetailsSave} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-[#0A0A0A] border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="w-full h-full text-gray-400 dark:text-gray-600 p-4" />
                  )}
                </div>
                <input
                  type="file"
                  id="logoFile"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                  disabled={saving}
                />
                <label
                  htmlFor="logoFile"
                  className="absolute bottom-0 right-0 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 cursor-pointer shadow-lg transform transition-transform duration-200 hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
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
                  className="mt-1 block w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 rounded"
                  rows={3}
                  disabled={saving}
                />
              </div>
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm dark:shadow-purple-900/20">
                  {saving ? "Saving..." : "Save Changes"}
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
      {/* Branch Selection Card */}
      {!isTemplateProject && (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 3v12M6 15a3 3 0 100 6 3 3 0 000-6zm0 0a9 9 0 019-9h3"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Branch Selection</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Change the selected branch
                </p>
              </div>
            </div>
            <form onSubmit={handleBranchSave} className="space-y-4">
              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Selected Branch
                </label>
                {branchesLoading ? (
                  <div className="text-xs text-gray-400">Loading branches...</div>
                ) : branchesError ? (
                  <div className="text-xs text-red-500">{branchesError}</div>
                ) : (
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem
                          key={branch}
                          value={branch}
                          className={
                            branch === project.selected_branch
                              ? "bg-purple-100 dark:bg-purple-900/30 font-semibold"
                              : ""
                          }>
                          <span className="flex items-center gap-2">
                            {branch}
                            {branch === project.selected_branch && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-purple-500 text-white">
                                Current
                              </span>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <Button
                type="submit"
                disabled={saving || branchesLoading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm dark:shadow-purple-900/20">
                {saving ? "Saving..." : "Update Branch"}
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* Delete Project Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? "Deleting..." : "Delete Project"}
        </Button>
      </div>
    </div>
  );
};

export default ProjectSettingsForm;

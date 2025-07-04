import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, Loader2, Upload } from "lucide-react";

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

interface NewProjectFormProps {
  repository: Repository;
  onSubmit: () => void;
  onBack: () => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ repository, onBack, onSubmit }) => {
  const isBlankProject = repository.id === -1;
  const getDefaultCommand = (template: string) => {
    switch (template) {
      case "nodejs":
        return "npm start";
      case "python":
        return "python main.py";
      case "nextjs":
        return "npm run dev";
      case "react":
        return "npm start";
      case "html":
        return "open index.html";
      case "bun":
        return "bun run start";
      case "deno":
        return "deno run main.ts";
      case "rust":
        return "cargo run";
      case "go":
        return "go run main.go";
      case "java":
        return "java Main";
      case "csharp":
        return "dotnet run";
      case "cpp":
        return "./main";
      case "php":
        return "php -S localhost:8000";
      case "ruby":
        return "ruby main.rb";
      case "swift":
        return "swift run";
      default:
        return "";
    }
  };

  const [project, setProject] = useState({
    name: repository.name,
    description: repository.description || "",
    selected_branch: repository.default_branch,
    logo: null as File | null,
    logoPreview: repository.avatar_url || "",
    repoid: repository.id.toString(),
    repo_url: repository.html_url,
    repo_name: repository.full_name,
    branch_url: repository.branches_url,
    languages_url: repository.languageUrl,
    commithistory_url: repository.commitHistory,
    logo_url: repository.avatar_url || "",
    template: "nodejs",
    command: isBlankProject ? getDefaultCommand("nodejs") : "npm start",
  });
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isBlankProject) {
      setBranches([]);
      return;
    }
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${SERVER_URL}/github/branches?branchUrl=${encodeURIComponent(repository.branches_url)}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch branches");
        const data = await response.json();
        setBranches(data.branches.map((branch: { name: string }) => branch.name) || []);
      } catch (error) {
        setBranches([repository.default_branch]);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [repository.full_name, repository.default_branch, isBlankProject]);

  const updateField = (field: string, value: string | File | null) => {
    setProject((prev) => {
      if (field === "template" && isBlankProject && typeof value === "string") {
        return { ...prev, template: value, command: getDefaultCommand(value) };
      }
      return { ...prev, [field]: value };
    });

    if (field === "logo" && value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setProject((prev) => ({ ...prev, logoPreview: e.target?.result as string }));
      reader.readAsDataURL(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.name || !project.command || loading || creating) return;
    setCreating(true);

    let logoUrl = project.logo_url;
    if (project.logo) {
      const formData = new FormData();
      formData.append("logo", project.logo);
      const uploadResponse = await fetch(`${SERVER_URL}/util/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (uploadResponse.ok) {
        const { url } = await uploadResponse.json();
        logoUrl = url;
      }
    }

    await fetch(`${SERVER_URL}/project/create`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        name: project.name,
        repoid: project.repoid,
        logo_url: logoUrl,
        repo_url: project.repo_url,
        repo_name: project.repo_name,
        branch_url: project.branch_url,
        description: project.description,
        languages_url: project.languages_url,
        selected_branch: project.selected_branch,
        commithistory_url: project.commithistory_url,
        template: isBlankProject ? project.template : undefined,
        command: project.command || "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setCreating(false);
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        {/* Logo Upload */}
        <div className="flex items-center gap-4">
          <div className="group relative w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
            {project.logoPreview ? (
              <>
                <img src={project.logoPreview} alt="Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <Upload className="w-6 h-6 text-gray-400" />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => updateField("logo", e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Change logo"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="logo" className="text-sm text-gray-600 dark:text-gray-400">
              Project Logo
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {project.logo ? project.logo.name : "Using repository avatar as default"}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={project.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="mt-1"
              required
            />
          </div>

          {!isBlankProject && (
            <div>
              <Label htmlFor="repo_name">Repository</Label>
              <Input
                id="repo_name"
                value={project.repo_name}
                className="mt-1 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-purple-900/30"
                disabled
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={project.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="command" className="flex items-center gap-1">
              Command to run project
              <span className="text-red-500 text-base">*</span>
            </Label>
            <Input
              id="command"
              value={project.command}
              onChange={(e) => updateField("command", e.target.value)}
              className={`mt-1 ${!project.command ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
              required
              placeholder="e.g. npm start, python main.py, etc."
            />
            {!project.command && (
              <p className="text-red-500 text-xs mt-1">Command is required to run your project</p>
            )}
          </div>

          {isBlankProject && (
            <div>
              <Label htmlFor="template">Template</Label>
              <select
                id="template"
                value={project.template}
                onChange={(e) => updateField("template", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none mt-1">
                <option value="nodejs">Node.js</option>
                <option value="python">Python</option>
                <option value="nextjs">Next.js</option>
                <option value="react">React</option>
                <option value="html">HTML/CSS/JS</option>
                <option value="bun">Bun</option>
                <option value="deno">Deno</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>
                <option value="blank">Blank (no template)</option>
              </select>
            </div>
          )}

          {!isBlankProject && (
            <div>
              <Label htmlFor="branch">Branch</Label>
              <div className="relative mt-1">
                <select
                  id="branch"
                  value={project.selected_branch}
                  onChange={(e) => updateField("selected_branch", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] px-3 py-2 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  disabled={loading}>
                  {loading ? (
                    <option>Loading branches...</option>
                  ) : (
                    branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {loading ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : (
                    <GitBranch className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={loading || !project.name || !project.command || creating}
          onClick={handleSubmit}>
          {creating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block align-middle" />
              Creating...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;

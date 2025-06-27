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

interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

interface NewProjectFormProps {
  repository: Repository;
  onSubmit: (projectData: ProjectData) => void;
  onBack: () => void;
}

interface ProjectData {
  name: string;
  description: string;
  branch: string;
  logo?: File;
  repositoryId: number;
  repositoryFullName: string;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ repository, onSubmit, onBack }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(repository.default_branch);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [formData, setFormData] = useState<Partial<ProjectData>>({
    name: repository.name,
    description: repository.description || "",
    branch: repository.default_branch,
    repositoryId: repository.id,
    repositoryFullName: repository.full_name,
  });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await fetch(repository.branches_url, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }

        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [repository.branches_url]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.branch) {
      onSubmit({
        ...(formData as ProjectData),
        logo: logo || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Project Logo</Label>
          <div className="mt-2 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Project logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
              <Label
                htmlFor="logo-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer">
                Upload Logo
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="branch">Branch</Label>
          <div className="relative mt-1">
            <select
              id="branch"
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setFormData({ ...formData, branch: e.target.value });
              }}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] px-3 py-2 pr-10 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              disabled={loading}>
              {loading ? (
                <option>Loading branches...</option>
              ) : (
                branches.map((branch) => (
                  <option key={branch.commit.sha} value={branch.name}>
                    {branch.name}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              {loading ? (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              ) : (
                <GitBranch className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={loading || !formData.name || !formData.branch}>
          Create Project
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;

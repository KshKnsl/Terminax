import { Request, Response } from "express";
import { UserInterface } from "../models/user";
import axios from "axios";

export class GitHubController {
  static async getRepositories(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as UserInterface;

    if (!user.accessToken) {
      res.status(401).json({ error: "GitHub access token not found" });
      return;
    }

    const response = await axios
      .get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          sort: "updated",
          per_page: 100,
          visibility: "all",
          affiliation: "owner,collaborator,organization_member",
        },
      })
      .catch((error) => {
        console.error("Error fetching GitHub repositories:", error.message);
        return null;
      });

    if (!response) {
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch repositories from GitHub",
      });
      return;
    }

    res.json({
      success: true,
      repositories: response.data,
    });
  }

  static async getPublicRepository(req: Request, res: Response): Promise<void> {
    const { owner, repo } = req.params;

    if (!owner || !repo) {
      res.status(400).json({ error: "Owner and repository name are required" });
      return;
    }

    const response = await axios
      .get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
      .catch((error) => {
        console.error(`Error fetching public repository ${owner}/${repo}:`, error.message);
        return null;
      });

    if (!response) {
      res.status(404).json({ error: "Repository not found or is private" });
      return;
    }

    res.json({
      success: true,
      repository: response.data,
    });
  }

  static async getBranches(req: Request, res: Response): Promise<void> {
    const { branchUrl } = req.params;

    console.log("Branch URL:", branchUrl);
    const response = await axios
      .get(`${branchUrl}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
      .catch((error) => {
        console.error(`Error fetching branches for ${branchUrl}:`, error.message);
        return null;
      });

    if (!response) {
      res.status(404).json({ error: "Repository not found or is private" });
      return;
    }

    res.json({
      success: true,
      branches: response.data,
    });
  }
}

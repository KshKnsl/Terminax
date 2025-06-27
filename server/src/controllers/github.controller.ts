import { Request, Response } from "express";
import { UserInterface } from "../models/user";
import axios from "axios";

export class GitHubController {
  static async getRepositories(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated() || !req.user || !req.user.accessToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as UserInterface;

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
  static async getBranches(req: Request, res: Response): Promise<void> {
    const user = req.user;
    if (!req.isAuthenticated() || !req.user || !req.user.accessToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { branchUrl } = req.query;
    
    if (!branchUrl || typeof branchUrl !== 'string') {
      res.status(400).json({ error: "Missing branch URL parameter" });
      return;
    }
    
    const decodedUrl = decodeURIComponent(branchUrl);

    console.log("Branch URL:", decodedUrl);
    const response = await axios.get(`${decodedUrl}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });

    res.json({
      success: true,
      branches: response.data,
    });
  } 
  static async getLanguages(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const { languages_url } = req.params;

    console.log("Languages URL:", languages_url);
    const response = await axios.get(`${languages_url}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });

    res.json({
      success: true,
      branches: response.data,
    });
  }
  static async getCommitsData(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const { commithistory_url } = req.params;

    console.log("Commit History URL:", commithistory_url);
    const response = await axios.get(`${commithistory_url}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });

    res.json({
      success: true,
      branches: response.data,
    });
  }
}

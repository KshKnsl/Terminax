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
    const response = await axios.get("https://api.github.com/user/repos", {
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
    });
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
    const decodedUrl = decodeURIComponent(branchUrl as string).replace(/\/branches(\{.*\})?$/, "/branches");
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
    const { languages_url } = req.query;
    const response = await axios.get(`${decodeURIComponent(languages_url as string)}`, {
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
    const { commithistory_url } = req.query;
    const response = await axios.get(`${decodeURIComponent(commithistory_url as string)}`, {
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

import { Project, ProjectInterface } from "../models/project";
import { Request, Response } from "express";

export class ProjectController {
  static async createProject(req: Request, res: Response) {
    try {
      const projectData = {
        ...(req.body as ProjectInterface),
        ownerId: (req as any).user?.id || (req as any).user?._id,
      };
      const projectDoc = new Project(projectData);
      await projectDoc.save();
      res.status(201).send({
        success: true,
        message: "Project created successfully",
        project: projectDoc,
      });
    } catch (err) {
      console.error("Failed to create project:", err);
      res.status(400).send({ error: err });
    }
  }

  static async getAllProjects(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      if (!userId) {
        return res.status(401).send({ error: "Unauthorized: No user id found" });
      }
      const projects = await Project.find({
        ownerId: { $exists: true, $ne: null, $eq: userId },
      }).sort({ createdAt: -1 });
      res.status(200).send({ success: true, projects });
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  static async getProjectById(req: Request, res: Response) {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).send({ error: "Project not found" });
      res.status(200).send({ success: true, project });
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!project) return res.status(404).send({ error: "Project not found" });
      res.status(200).send({ success: true, message: "Project updated", project });
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }
}

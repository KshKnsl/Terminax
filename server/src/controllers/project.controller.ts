import { Project, ProjectInterface } from "../models/project";
import { Request, Response } from "express";
function generatedeploymentLink(length = 5) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }
export class ProjectController {
  static async createProject(req: Request, res: Response) {
    try {

      let deploymentLink;
      let unique = false;
      while (!unique) {
        deploymentLink = generatedeploymentLink();
        const exists = await Project.findOne({ deploymentLink });
        if (!exists) unique = true;
      }

      const projectData = {
        ...(req.body as ProjectInterface),
        ownerId: (req as any).user?.id || (req as any).user?._id,
        deploymentLink,
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

  static async updateBranch(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      if (!userId) {
        return res.status(401).send({ error: "Unauthorized: No user id found" });
      }
      const { id, selected_branch } = req.body;
      if (!id || !selected_branch) {
        return res.status(400).send({ error: "Project id and selected_branch are required" });
      }
      const project = await Project.findOneAndUpdate(
        { _id: id, ownerId: userId },
        { selected_branch },
        { new: true }
      );
      if (!project)
        return res.status(404).send({ error: "Project not found or not owned by user" });
      res.status(200).send({ success: true, message: "Selected branch updated", project });
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  static async updateDetails(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      if (!userId) {
        return res.status(401).send({ error: "Unauthorized: No user id found" });
      }
      const { id, name, description, logo_url } = req.body;
      if (!id) {
        return res.status(400).send({ error: "Project id is required" });
      }
      const updateFields: any = {};
      if (name !== undefined) updateFields.name = name;
      if (description !== undefined) updateFields.description = description;
      if (logo_url !== undefined) updateFields.logo_url = logo_url;
      const project = await Project.findOneAndUpdate({ _id: id, ownerId: userId }, updateFields, {
        new: true,
      });
      if (!project)
        return res.status(404).send({ error: "Project not found or not owned by user" });
      res.status(200).send({ success: true, message: "Project details updated", project });
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }
}

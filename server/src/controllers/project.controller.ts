import { Project, ProjectInterface } from "../models/project";
import { Request, Response } from "express";
import { cloneRepository } from "../utils/cloner.util";
function generatedeploymentLink(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export class ProjectController {
  static async createProject(req: Request, res: Response) {
    let deploymentLink;
    let unique = false;
    while (!unique) {
      deploymentLink = generatedeploymentLink();
      const exists = await Project.findOne({ deploymentLink });
      if (!exists) unique = true;
    }
    const {
      name,
      logo_url,
      template,
      repoid,
      repo_url,
      repo_name,
      branch_url,
      description,
      languages_url,
      selected_branch,
      commithistory_url,
    } = req.body;

    const ownerId = (req as any).user?.id || (req as any).user?._id;
    const baseData = {
      name,
      logo_url,
      template,
      ownerId,
      deploymentLink,
    };

    let projectData: any;
    // GitHub-based project
    if (repoid && repo_url) {
      projectData = {
        ...baseData,
        repoid,
        repo_url,
        repo_name,
        branch_url,
        description,
        languages_url,
        selected_branch,
        commithistory_url,
      };
    } else {
      projectData = {
        ...baseData,
        description,
      };
    }
    const codestorageUrl = await cloneRepository(projectData, (req as any).user?.accessToken);
    const projectDoc = new Project({ ...projectData, codestorageUrl });
    await projectDoc.save();
    res.status(201).send({
      success: true,
      message: "Project created successfully",
      project: projectDoc,
    });
  }

  static async getAllProjects(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const projects = await Project.find({
      ownerId: { $exists: true, $ne: null, $eq: userId },
    }).sort({ createdAt: -1 });
    res.status(200).send({ success: true, projects });
  }

  static async getProjectById(req: Request, res: Response) {
    const project = await Project.findById(req.params.id);
    res.status(200).send({ success: true, project });
  }

  static async updateProject(req: Request, res: Response) {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send({ success: true, message: "Project updated", project });
  }

  static async updateBranch(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const { id, selected_branch } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: id, ownerId: userId },
      { selected_branch },
      { new: true }
    );
    res.status(200).send({ success: true, message: "Selected branch updated", project });
  }

  static async updateDetails(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const { id, name, description, logo_url } = req.body;
    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (logo_url !== undefined) updateFields.logo_url = logo_url;
    const project = await Project.findOneAndUpdate({ _id: id, ownerId: userId }, updateFields, {
      new: true,
    });
    res.status(200).send({ success: true, message: "Project details updated", project });
  }
  static async deleteProject(req:Request, res: Response)
  {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const {projId}= req.body;
    const projectdeleted = await Project.deleteOne({ _id: projId, ownerId: userId });
    if(projectdeleted.deletedCount > 0)
      res.status(200).send({ success: true, message: "Project deleted successfully" });
    res.status(404).send({ success: false, message: "Project not found or you do not have permission to delete it" });
  }
}


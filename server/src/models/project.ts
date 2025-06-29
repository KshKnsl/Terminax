import mongoose, { Document, Schema } from "mongoose";

export interface ProjectInterface extends Document {
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
  lastDeploymentDate?: Date;
  deploymentLink?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    repoid: {
      type: String,
      required: true,
      unique: true,
    },
    logo_url: {
      type: String,
      required: true,
    },
    repo_url: {
      type: String,
      required: true,
    },
    repo_name: {
      type: String,
      required: true,
    },
    branch_url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    languages_url: {
      type: String,
      required: true,
    },
    selected_branch: {
      type: String,
      required: true,
    },
    commithistory_url: {
      type: String,
      required: true,
    },
    lastDeploymentDate: {
      type: Date,
      default: null,
    },
    deploymentLink: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model<ProjectInterface>("Project", ProjectSchema);

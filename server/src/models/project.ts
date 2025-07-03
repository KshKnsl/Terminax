import mongoose, { Document, Schema } from "mongoose";
export interface ProjectInterface extends Document {
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
  lastDeploymentDate?: Date;
  deploymentLink?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  template?: string;
  codestorageUrl?: string;
  command: string;
}

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    repoid: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    logo_url: {
      type: String,
      required: false,
    },
    repo_url: {
      type: String,
      required: false,
    },
    repo_name: {
      type: String,
      required: false,
    },
    branch_url: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    languages_url: {
      type: String,
      required: false,
    },
    selected_branch: {
      type: String,
      required: false,
    },
    commithistory_url: {
      type: String,
      required: false,
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
    template: {
      type: String,
    },
    command: {
      type: String,
      required: true,
    },
    codestorageUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model<ProjectInterface>("Project", ProjectSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
  username?: string;
  displayName?: string;
  email: string;
  avatar?: string;
  provider: string;
  githubId?: string;
  plan?: {
    name: string;
    maxApps: number;
    maxSessions: number;
    features: string[];
  };
  stats?: {
    totalApps: number;
    activeSessions: number;
    totalSessions: number;
  };
  createdAt: Date;
  lastLogin?: Date;
  updatedAt: Date;
  accessToken?: string;
  refreshToken?: string;
  password?: string; 
}

const UserSchema = new Schema(
  {
    password: {
      type: String,
      select: false, // Do not return password by default
    },
    username: {
      type: String,
      unique: true,
    },
    displayName: String,
    email: {
      type: String,
      required: true,
    },
    avatar: String,
    provider: {
      type: String,
      required: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple docs with undefined githubId
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple docs with undefined googleId
    },
    plan: {
      name: {
        type: String,
        default: "Free Tier",
      },
      maxApps: {
        type: Number,
        default: 3,
      },
      maxSessions: {
        type: Number,
        default: 5,
      },
      features: {
        type: [String],
        default: [
          "Basic terminal access",
          "GitHub integration",
          "3 apps limit",
          "5 concurrent sessions",
        ],
      },
    },
    stats: {
      totalApps: {
        type: Number,
        default: 0,
      },
      activeSessions: {
        type: Number,
        default: 0,
      },
      totalSessions: {
        type: Number,
        default: 0,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    accessToken: String,
    refreshToken: String,
  },
  { timestamps: true }
);

export const User = mongoose.model<UserInterface>("User", UserSchema);

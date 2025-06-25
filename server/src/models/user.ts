import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
  username: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  provider: string;
  githubId?: string;
  createdAt: Date;
  lastLogin?: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: String,
    email: {
      type: String,
      unique: true,
    },
    avatar: String,
    provider: {
      type: String,
      required: true,
    },
    githubId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserInterface>("User", UserSchema);

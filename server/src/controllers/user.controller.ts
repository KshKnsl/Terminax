import { Request, Response } from "express";
import { User, UserInterface } from "../models/user";
import uploadImage from "../utils/uploadImage";

export class UserController {
  static async findById(id: string): Promise<UserInterface | null> {
    const user = await User.findById(id).catch((err) => {
      console.error("Failed to find user:", err);
      return null;
    });
    return user;
  }

  static async updateLastLogin(id: string): Promise<UserInterface | null> {
    const user = await User.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true }).catch(
      (err) => {
        console.error("Failed to update last login:", err);
        return null;
      }
    );
    return user;
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { displayName } = req.body as { displayName?: string };
    const userId = (req.user as UserInterface).id;
    const currentUser = req.user as UserInterface;
    let avatarUrl = currentUser.avatar;

    // Handle avatar upload if provided
    if (req.file) {
      avatarUrl = await uploadImage(req.file.path, userId).catch(() => {
        res.status(500).json({ error: "Failed to upload avatar image" });
        return undefined;
      });
      if (!avatarUrl) return;
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        displayName: displayName?.trim(),
        avatar: avatarUrl,
      },
      { new: true }
    ).catch((err) => {
      if (err.message?.includes("validation")) {
        res.status(400).json({ error: "Invalid input data" });
        return null;
      }
      if (err.message?.includes("duplicate")) {
        res.status(409).json({ error: "Display name already taken" });
        return null;
      }
      res.status(500).json({ error: "Failed to update profile" });
      return null;
    });

    if (!updatedUser) return;

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  }
}

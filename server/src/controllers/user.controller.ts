import { Request, Response } from "express";
import { User, UserInterface } from "../models/user";

export class UserController {
  static async findById(userId: string): Promise<UserInterface | null> {
    return await User.findById(userId);
  }

  static async updateLastLogin(userId: string): Promise<boolean> {
    const result = await User.findByIdAndUpdate(userId, { lastLogin: new Date() }, { new: true });

    return !!result;
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as UserInterface).id;
    const { displayName, email } = req.body;

    if (!displayName && !email) {
      res.status(400).json({ error: "No update data provided" });
      return;
    }

    const updateData: Partial<UserInterface> = {};

    if (displayName) {
      updateData.displayName = displayName;
    }

    if (email) {
      updateData.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
      },
    });
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as UserInterface).id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        provider: user.provider,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  }
}

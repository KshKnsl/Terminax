import { Request, Response } from "express";
import { User, UserInterface } from "../models/user";
import uploadImage from "../utils/uploadImage";

export class UserController {
  static async findById(id: string): Promise<UserInterface | null> {
    const user = await User.findById(id);
    return user;
  }

  static async updateLastLogin(id: string): Promise<UserInterface | null> {
    const user = await User.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true });
    return user;
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { displayName } = req.body as { displayName?: string };
    const userId = (req.user as UserInterface).id;
    const curr = req.user as UserInterface;
    let avat = curr.avatar;

    if (req.file) avat = await uploadImage(req.file.path, userId);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      displayName: displayName?.trim(),
      avatar: avat,
    });
    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  }
}

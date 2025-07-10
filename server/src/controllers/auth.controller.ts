import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { User, UserInterface } from "../models/user";
import { UserController } from "./user.controller";

interface AuthResponse {
  error?: string;
  message?: string;
  success?: boolean;
  isAuthenticated?: boolean;
  user?: Partial<UserInterface>;
}

export class AuthController {
  static async registerWithEmail(req: Request, res: Response): Promise<void> {
    const { email, password, displayName } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash, displayName, provider: "email" });
    await user.save();
    res.json({ success: true, message: "Registered successfully" });
  }

  static async loginWithEmail(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const user = await User.findOne({ email, provider: "email" }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }
    if (user.password) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return;
      }
    }
    req.login(user, () => {
      res.json({ success: true, user });
    });
  }

  static async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const user = req.user as UserInterface;
    await UserController.updateLastLogin(user.id);
    res.redirect(`${clientUrl}/dashboard`);
  }

  static async handleGithubCallback(req: Request, res: Response): Promise<void> {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const user = req.user as UserInterface;
    await UserController.updateLastLogin(user.id);
    res.redirect(`${clientUrl}/dashboard`);
 
  }

  static async getStatus(req: Request, res: Response): Promise<void> {
    console.log("\n=== getStatus Request ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session Cookie:", req.headers.cookie?.split(";").find((c) => c.trim().startsWith("connect.sid=")));
    console.log("Session Data:", req.session);
    console.log("Is Authenticated:", req.isAuthenticated());
    console.log("User:", req.user);
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);

    if (!req.isAuthenticated()) {
      console.log("Not authenticated - sending 401");
      res.status(401).json({
        isAuthenticated: false,
        user: undefined,
        message: "Not authenticated"
      } satisfies AuthResponse);
      return;
    }

    const user = req.user as UserInterface;
    console.log("Authenticated user:", user);
    res.json({ message: "Authenticated", user });
    console.log("=== getStatus End ===\n");
  }

  static async logout(req: Request, res: Response): Promise<void> {
    req.logout(() => {
      res.json({ success: true, message: "Logged out successfully" });
    });
  }

  static async deleteAccount(req: Request, res: Response): Promise<void> {
    const userId = (req.user as UserInterface).id;
    await User.findByIdAndDelete(userId);
    req.logout(() => {
      res.json({ success: true, message: "Account deleted successfully" });
    });
  }
}

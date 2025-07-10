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
  }  static async handleGithubCallback(req: Request, res: Response): Promise<void> {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const user = req.user as UserInterface;
    await UserController.updateLastLogin(user.id);
    
    // Log session details
    console.log('Github Callback - Session:', req.session);
    console.log('Github Callback - User:', req.user);
    console.log('Github Callback - Is Authenticated:', req.isAuthenticated());    
    res.redirect(`${clientUrl}/dashboard`);
  }

  static async getStatus(req: Request, res: Response): Promise<void> {
    console.log("Session:", req.session);
    console.log("Is Authenticated:", req.isAuthenticated());
    console.log("User:", req.user);
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);

    if (!req.isAuthenticated() || !req.user) {
      console.log("Not authenticated or no user");
      res.json({
        isAuthenticated: false,
        user: undefined,
      } satisfies AuthResponse);
      return;
    }

    const sessionUser = req.user as UserInterface;
    const user = await UserController.findById(sessionUser.id);

    if (!user) {
      console.log("User not found in database");
      res.json({
        isAuthenticated: false,
        user: undefined,
      } satisfies AuthResponse);
      return;
    }

    console.log("Authentication successful, returning user");
    res.json({
      isAuthenticated: true,
      user: {
        _id: user.id,
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        provider: user.provider,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    } satisfies AuthResponse);
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

import { Request, Response } from "express"
import { User, UserInterface } from "../models/user"
import { UserController } from "./user.controller"

interface AuthResponse {
  error?: string
  message?: string
  success?: boolean
  isAuthenticated?: boolean
  user?: Partial<UserInterface>
}

export class AuthController {
  static async handleGithubCallback(req: Request, res: Response): Promise<void> {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173"

    if (!req.user) {
      console.error("GitHub authentication failed: No user data received")
      res.redirect(clientUrl)
      return
    }

    const user = req.user as UserInterface
    const updateResult = await UserController.updateLastLogin(user.id)

    if (!updateResult) {
      console.error(`Failed to update last login time for user ${user.username}`)
      res.redirect(clientUrl)
      return
    }

    console.info(`User ${user.username} successfully authenticated via GitHub`)
    res.redirect(`${clientUrl}/dashboard`)
  }

  static async getStatus(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated() || !req.user) {
      res.json({
        isAuthenticated: false,
        message: "No active session found"
      } satisfies AuthResponse)
      return
    }

    const sessionUser = req.user as UserInterface
    const user = await UserController.findById(sessionUser.id)

    if (!user) {
      console.warn(`Session found but no user data for ID: ${sessionUser.id}`)
      res.json({
        isAuthenticated: false,
        message: "User data not found"
      } satisfies AuthResponse)
      return
    }

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
        lastLogin: user.lastLogin
      }
    } satisfies AuthResponse)
  }

  static async logout(req: Request, res: Response): Promise<void> {
    const username = (req.user as UserInterface)?.username

    req.logout(() => {
      console.info(`User ${username || "unknown"} logged out`)
      res.json({ success: true, message: "Logged out successfully" })
    })
  }

  static async deleteAccount(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const userId = (req.user as UserInterface).id
    const deleted = await User.findByIdAndDelete(userId)

    if (!deleted) {
      res.status(404).json({ error: "User not found" })
      return
    }

    req.logout(() => {
      console.info(`User account deleted: ${deleted.username}`)
      res.json({ success: true, message: "Account deleted successfully" })
    })
  }
}

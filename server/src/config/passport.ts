import passport from "passport"
import { Strategy as GitHubStrategy } from "passport-github2"
import { User, UserInterface } from "../models/user"

declare global {
  namespace Express {
    interface User extends UserInterface {}
  }
}

export default function configurePassport(): void {
  // Store only user ID in session
  passport.serializeUser((user: UserInterface, done) => {
    done(null, user.id)
  })

  // Retrieve user from database using session ID
  passport.deserializeUser(async (id: string, done) => {
    const user = await User.findById(id)

    if (!user) {
      return done(null, false)
    }

    return done(null, user)
  })

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback",
        scope: ["user:email", "repo"]
      },
      handleGitHubCallback
    )
  )
}

async function handleGitHubCallback(accessToken: string, refreshToken: string, profile: any, done: any) {
  const userData = {
    username: profile.username,
    displayName: profile.displayName || profile.username,
    email: profile.emails?.[0]?.value || null,
    avatar: profile.photos?.[0]?.value || null,
    provider: "github",
    githubId: profile.id,
    accessToken,
    refreshToken
  }

  const existingUser = await User.findOne({ githubId: profile.id })

  let user = null
  if (existingUser) {
    const { avatar, displayName, ...updatableData } = userData
    user = await User.findOneAndUpdate({ githubId: profile.id }, updatableData, {
      new: true
    })
  } else {
    user = await User.create(userData)
  }

  if (!user) {
    console.error("Failed to save user data")
    return done(new Error("Authentication failed"), null)
  }

  return done(null, user)
}

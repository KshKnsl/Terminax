import { Strategy as LocalStrategy } from "passport-local";

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User, UserInterface } from "../models/user";

declare global {
  namespace Express {
    interface User extends UserInterface {}
  }
}

export default function configurePassport(): void {
  passport.serializeUser((user: UserInterface, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    const user = await User.findById(id);
    if (!user) return done(null, false);
    return done(null, user);
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        callbackURL:
          process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback",
        scope: ["user:email", "repo"],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        // Assume email always exists
        const email = profile.emails[0].value;
        const user = await User.findOne({ email });
        if (!user) {
          // Create new user
          const userData = {
            username: profile.username,
            displayName: profile.displayName || profile.username,
            email,
            avatar: profile.photos?.[0]?.value || null,
            provider: "github",
            githubId: profile.id,
            accessToken,
            refreshToken,
          };
          const newUser = await User.create(userData);
          return done(null, newUser);
        }
        if (user.provider && user.provider !== "github") {
          return done(null, false, {
            message: `This email is already registered with ${user.provider}. Please use the correct login method.`,
          });
        }
        // If user exists with githubId, update, else update email user to github
        if (user.githubId === profile.id) {
          const { avatar, displayName, ...updatableData } = {
            username: profile.username,
            displayName: profile.displayName || profile.username,
            email,
            avatar: profile.photos?.[0]?.value || null,
            provider: "github",
            githubId: profile.id,
            accessToken,
            refreshToken,
          };
          const updatedUser = await User.findOneAndUpdate({ githubId: profile.id }, updatableData, {
            new: true,
          });
          return done(null, updatedUser);
        } else {
          // Upgrade existing user to github
          user.provider = "github";
          user.githubId = profile.id;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          await user.save();
          return done(null, user);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        const email = profile.emails[0].value;
        const user = await User.findOne({ email });
        if (!user) {
          const userData = {
            username: email.split("@")[0],
            displayName: profile.displayName || email,
            email,
            avatar: profile.photos?.[0]?.value || null,
            provider: "google",
          };
          const newUser = await User.create(userData);
          return done(null, newUser);
        }
        if (user.provider && user.provider != "google") {
          return done(null, false, {
            message: `This email is already registered with ${user.provider}. Please use the correct login method.`,
          });
        }
        const userData = {
          username: email.split("@")[0],
          displayName: profile.displayName || email,
          email,
          avatar: profile.photos?.[0]?.value || null,
          provider: "google",
        };
        const updatedUser = await User.findOneAndUpdate({ email }, userData, { new: true });
        return done(null, updatedUser);
      }
    )
  );
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async (email, password, done) => {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Incorrect email." });
        if (user.provider && user.provider != "email")
          return done(null, false, {
            message: `This email is already registered with ${user.provider}. Please use the correct login method.`,
          });
        const valid = await require("bcryptjs").compare(password, user.password);
        if (!valid) return done(null, false, { message: "Incorrect password." });
        return done(null, user);
      }
    )
  );
}

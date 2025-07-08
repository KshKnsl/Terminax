import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { User, UserInterface } from "../models/user";

declare global {
  namespace Express {
    interface User extends UserInterface {}
  }
}

const checkProvider = (u: any, exp: string) => {
  if (u.provider && u.provider !== exp) {
    return {
      conflict: true,
      msg: `This email is already registered with ${u.provider}. Please use the correct login method.`,
    };
  }
  return { conflict: false, msg: "" };
};

const createData = (p: any, prov: string, extra?: any) => {
  const base = {
    username: prov === "google" ? p.emails[0].value.split("@")[0] : p.username,
    displayName: p.displayName || p.username || p.emails[0].value,
    email: p.emails[0].value,
    avatar: p.photos?.[0]?.value || null,
    provider: prov,
  };
  return { ...base, ...extra };
};

export default function configurePassport(): void {
  passport.serializeUser((u: UserInterface, done) => {
    done(null, u.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    const u = await User.findById(id);
    if (!u) return done(null, false);
    return done(null, u);
  });
  const validateCallbackURL = (url: string | undefined, defaultUrl: string): string => {
    if (!url) return defaultUrl;
    try {
      new URL(url);
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
    } catch {
      console.warn(`Invalid callback URL: ${url}, using default: ${defaultUrl}`);
    }
    return defaultUrl;
  };

  const githubCallbackURL = validateCallbackURL(
    process.env.GITHUB_CALLBACK_URL, 
    "http://localhost:3000/auth/github/callback"
  );
  
  const googleCallbackURL = validateCallbackURL(
    process.env.GOOGLE_CALLBACK_URL, 
    "http://localhost:3000/auth/google/callback"
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        callbackURL: githubCallbackURL,
        scope: ["user:email", "repo"],
      },
      async (at: string, rt: string, p: any, done: any) => {
        const email = p.emails[0].value;
        const u = await User.findOne({ email });

        if (!u) {
          const data = createData(p, "github", {
            githubId: p.id,
            accessToken: at,
            refreshToken: rt,
          });
          const newU = await User.create(data);
          return done(null, newU);
        }

        const check = checkProvider(u, "github");
        if (check.conflict) {
          return done(null, false, { message: check.msg });
        }

        const data = createData(p, "github", {
          githubId: p.id,
          accessToken: at,
          refreshToken: rt,
        });

        const updatedU = await User.findOneAndUpdate({ email }, data, { new: true });
        return done(null, updatedU);
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: googleCallbackURL,
      },
      async (at: string, rt: string, p: any, done: any) => {
        const email = p.emails[0].value;
        const u = await User.findOne({ email });

        if (!u) {
          const data = createData(p, "google");
          const newU = await User.create(data);
          return done(null, newU);
        }

        const check = checkProvider(u, "google");
        if (check.conflict) {
          return done(null, false, { message: check.msg });
        }

        const data = createData(p, "google");
        const updatedU = await User.findOneAndUpdate({ email }, data, { new: true });
        return done(null, updatedU);
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
        const u = await User.findOne({ email });
        if (!u) return done(null, false, { message: "Incorrect email." });

        const check = checkProvider(u, "email");
        if (check.conflict) {
          return done(null, false, { message: check.msg });
        }

        if (!u.password) return done(null, false, { message: "No password set." });
        const valid = await bcrypt.compare(password, u.password);
        if (!valid) return done(null, false, { message: "Incorrect password." });
        return done(null, u);
      }
    )
  );
}

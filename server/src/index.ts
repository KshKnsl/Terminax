import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import path from "path";
import configurePassport from "./config/passport";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import gitRoutes from "./routes/github";
import projectRoutes from "./routes/project";
import utilRoutes from "./routes/util";

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/terminaux")
  .then(() => console.info("Connected to MongoDB"))
  .catch((err) => console.error(`MongoDB error: ${err}`));

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
 
app.use('/fetched_active_projects', express.static(path.join(__dirname, '../fetched_active_projects')));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

app.use((req, res, next) => {
  if (req.path.startsWith("/auth") || req.path === "/") {
    return next();
  }
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized", message: "Unauthorized" });
  }
  next();
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/users", userRoutes);
app.use("/github", gitRoutes);
app.use("/project", projectRoutes);
app.use("/util", utilRoutes);
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Terminax API server" });
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});

export default app;

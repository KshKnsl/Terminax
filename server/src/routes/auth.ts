import express, { Request, Response } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email", "repo"],
    session: true,
  })
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login`,
    session: true,
  }),
  AuthController.handleGithubCallback
);

router.get("/status", (req: Request, res: Response) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user
      ? {
          id: req.user.id,
          username: req.user.username,
          avatar: req.user.avatar,
        }
      : null,
  });
});

router.get("/logout", AuthController.logout);

router.delete("/user", AuthController.deleteAccount);

export default router;

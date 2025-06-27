import express from "express";
import { GitHubController } from "../controllers/github.controller";

const router = express.Router();

router.get("/repositories", GitHubController.getRepositories);
router.get("/branches", GitHubController.getBranches);
router.get("/commits", GitHubController.getCommitsData);
router.get("/languages", GitHubController.getLanguages);

export default router;

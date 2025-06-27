import express from "express";
import { ProjectController } from "../controllers/project.controller";
const router = express.Router();
router.post("/createProject", ProjectController.createProject);
export default router;

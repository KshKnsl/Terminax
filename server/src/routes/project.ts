import express from "express";
import { ProjectController } from "../controllers/project.controller";
const router = express.Router();
router.post("/create", ProjectController.createProject);
router.get("/getall", ProjectController.getAllProjects);
router.get("/get/:id", ProjectController.getProjectById);
router.put("/update/:id", ProjectController.updateProject);
export default router;

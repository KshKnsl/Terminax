import express from "express";
import { ProjectController } from "../controllers/project.controller";
const router = express.Router();
router.post("/create", ProjectController.createProject);
router.get("/getall", ProjectController.getAllProjects);
router.get("/get/:id", ProjectController.getProjectById);
router.put("/update/:id", ProjectController.updateProject);
router.post("/updateBranch", ProjectController.updateBranch);
router.post("/updateDetails", ProjectController.updateDetails);
router.delete("/delete", ProjectController.deleteProject);
router.get("/getAllFiles/:id", ProjectController.fetchProjectFilesById);
router.get("/command/:id", ProjectController.getProjectCommand);
router.put("/command/:id", ProjectController.updateProjectCommand);
export default router;

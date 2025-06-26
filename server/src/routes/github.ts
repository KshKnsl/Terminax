import express from 'express';
import { GitHubController } from '../controllers/github.controller';

const router = express.Router();

router.get('/repositories', GitHubController.getRepositories);

export default router;

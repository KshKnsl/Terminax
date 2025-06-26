import express from 'express';
import upload from '../middleware/multer';
import { UserController } from '../controllers/user.controller';

const router = express.Router();

router.put('/profile', upload.single('avatar'), UserController.updateProfile);

export default router;

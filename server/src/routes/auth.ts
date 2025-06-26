import express from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: process.env.CLIENT_URL || 'http://localhost:5173'
  }),
  AuthController.handleGithubCallback
);

router.get('/status', AuthController.getStatus);

router.get('/logout', AuthController.logout);

router.delete('/user', AuthController.deleteAccount);

export default router;

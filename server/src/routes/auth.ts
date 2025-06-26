import express from 'express';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User, UserInterface } from '../models/user';

const router = express.Router();
declare global {
  namespace Express {
    interface User extends UserInterface {}
  }
}

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: process.env.CLIENT_URL || 'http://localhost:5173'
  }),
  async (req: Request, res: Response) => {
    if (req.user) {
      try {
        await User.findByIdAndUpdate(req.user.id, { lastLogin: new Date() });
        console.info(`User ${req.user.username} successfully authenticated`);
      } catch (error) {
        console.error('Error updating last login time:', error);
      }
    }
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173/dashboard');
  }
);

router.get('/status', async (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.json({ isAuthenticated: false });
      }

      return res.json({
        isAuthenticated: true,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          plan: user.plan,
          stats: user.stats,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          githubConnectedAt: user.lastLogin,
        }
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ error: 'Failed to fetch user details' });
    }
  }
  return res.json({ isAuthenticated: false });
});

router.delete('/user', (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = req.user.id;
  
  req.logout(async (err: Error) => {
    if (err) {
      console.error(`Error during logout: ${err.message}`);
      return res.status(500).json({ error: 'Failed to logout during account deletion.' });
    }

    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      console.log(`User with ID: ${userId} deleted successfully.`);
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (dbError: any) {
      console.error(`Database error during account deletion: ${dbError.message}`);
      res.status(500).json({ error: 'Failed to delete account from database.' });
    }
  });
});

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if (err) { 
      console.error(`Error during logout: ${err.message}`);
      return res.status(500).json({ error: 'Failed to logout' }); 
    }
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  });
});

export default router;

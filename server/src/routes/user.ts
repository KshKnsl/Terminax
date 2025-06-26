import express from 'express';
import { Request, Response } from 'express';
import { User } from '../models/user';
import upload from '../middleware/multer';
import uploadImage from '../utils/uploadImage';

const router = express.Router();

router.put('/profile', upload.single('avatar'), async (req: Request, res: Response) => {
    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { displayName } = req.body;
    const userId = req.user.id;

    try {
        let avatarUrl = req.user.avatar;
        if (req.file) {
            avatarUrl = await uploadImage(req.file.path, userId);
            console.log('Avatar uploaded:', avatarUrl);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { displayName, avatar: avatarUrl }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                displayName: updatedUser.displayName,
                avatar: updatedUser.avatar,
                plan: updatedUser.plan,
                stats: updatedUser.stats,
                createdAt: updatedUser.createdAt,
                lastLogin: updatedUser.lastLogin,
                githubConnectedAt: updatedUser.lastLogin
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;

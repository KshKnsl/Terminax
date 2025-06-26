import { Request, Response } from 'express';
import { User, UserInterface } from '../models/user';
import uploadImage from '../utils/uploadImage';

export class UserController {
    static async findById(id: string): Promise<UserInterface | null> {
        try {
            return await User.findById(id);
        } catch (error) {
            console.error('Error finding user by ID:', error);
            return null;
        }
    }

    static async updateLastLogin(id: string): Promise<UserInterface | null> {
        try {
            return await User.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true });
        } catch (error) {
            console.error('Error updating last login:', error);
            return null;
        }
    }

    static async updateProfile(req: Request, res: Response): Promise<void> {
        if (!req.isAuthenticated() || !req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { displayName } = req.body as { displayName?: string };
        const userId = (req.user as UserInterface).id;

        try {
            // Handle avatar upload
            let avatarUrl = (req.user as UserInterface).avatar;
            if (req.file) {
                try {
                    avatarUrl = await uploadImage(req.file.path, userId);
                    console.log('Avatar uploaded successfully:', avatarUrl);
                } catch (uploadError) {
                    console.error('Avatar upload failed:', uploadError);
                    res.status(500).json({ error: 'Failed to upload avatar image' });
                    return;
                }
            }

            // Update profile
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { 
                    displayName: displayName?.trim(), 
                    avatar: avatarUrl 
                },
                { new: true }
            );

            if (!updatedUser) {
                console.error(`User not found with ID: ${userId}`);
                res.status(404).json({ error: 'User not found' });
                return;
            }

            console.log(`Profile updated successfully for user: ${userId}`);
            res.json({
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            
            if (error instanceof Error) {
                if (error.message.includes('validation')) {
                    res.status(400).json({ error: 'Invalid input data' });
                    return;
                }
                if (error.message.includes('duplicate')) {
                    res.status(409).json({ error: 'Display name already taken' });
                    return;
                }
            }
            
            res.status(500).json({ 
                error: 'Failed to update profile. Please try again later.' 
            });
        }
    }
}

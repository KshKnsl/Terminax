import { Request, Response } from 'express';
import { User, UserInterface } from '../models/user';
import { UserController } from './user.controller';

type AuthResponse = {
    error?: string;
    message?: string;
    success?: boolean;
    isAuthenticated?: boolean;
    user?: UserInterface;
};

export class AuthController {
    static async handleGithubCallback(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            console.error('GitHub authentication failed: No user data received');
            res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}`);
            return;
        }

        const user = req.user as UserInterface;

        try {
            await UserController.updateLastLogin(user.id);
            console.info(`User ${user.username} successfully authenticated via GitHub`);
            res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`);
        } catch (error) {
            console.error('Error updating last login time:', error);
            res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}`);
        }
    }

    static async getStatus(req: Request, res: Response): Promise<void> {
        try {
            if (!req.isAuthenticated() || !req.user) {
                res.json({
                    isAuthenticated: false,
                    message: 'No active session found',
                } satisfies AuthResponse);
                return;
            }

            const user = await UserController.findById((req.user as UserInterface).id);
            if (!user) {
                console.warn(`Session found but no user data for ID: ${(req.user as UserInterface).id}`);
                res.json({
                    isAuthenticated: false,
                    message: 'User data not found',
                } satisfies AuthResponse);
                return;
            }

            res.json({
                isAuthenticated: true,
                user
            } satisfies AuthResponse);
        } catch (error) {
            console.error('Error fetching user status:', error);
            res.status(500).json({
                error: 'Failed to fetch user status',
                message: 'An unexpected error occurred while checking authentication status',
            } satisfies AuthResponse);
        }
    }

    static async logout(req: Request, res: Response): Promise<void> {
        if (!req.isAuthenticated()) {
            res.status(400).json({
                error: 'No active session to logout',
            } satisfies AuthResponse);
            return;
        }

        const username = (req.user as UserInterface).username;

        req.logout((err: Error | null) => {
            if (err) {
                console.error(`Error during logout for user ${username}:`, err);
                res.status(500).json({
                    error: 'Failed to logout',
                    message: 'An unexpected error occurred during logout',
                } satisfies AuthResponse);
                return;
            }

            console.info(`User ${username} logged out successfully`);
            res.json({
                success: true,
                message: 'Logged out successfully',
            } satisfies AuthResponse);
        });
    }

    static async deleteAccount(req: Request, res: Response): Promise<void> {
        if (!req.isAuthenticated() || !req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'You must be logged in to delete your account',
            } satisfies AuthResponse);
            return;
        }

        const user = req.user as UserInterface;
        const userId = user.id;
        const username = user.username;

        try {
            req.logout(async (logoutErr: Error | null) => {
                if (logoutErr) {
                    console.error(`Error during logout for account deletion (${username}):`, logoutErr);
                    res.status(500).json({
                        error: 'Failed to process account deletion',
                        message: 'Error occurred during session cleanup',
                    } satisfies AuthResponse);
                    return;
                }

                try {
                    const deletedUser = await User.findByIdAndDelete(userId);
                    if (!deletedUser) {
                        res.status(404).json({
                            error: 'User not found',
                            message: 'Account could not be found for deletion',
                        } satisfies AuthResponse);
                        return;
                    }

                    console.info(`Account deleted successfully for user: ${username}`);
                    res.status(200).json({
                        success: true,
                        message: 'Account deleted successfully',
                    } satisfies AuthResponse);
                } catch (dbError) {
                    console.error(`Database error during account deletion (${username}):`, dbError);
                    res.status(500).json({
                        error: 'Failed to delete account',
                        message: 'An error occurred while removing account data',
                    } satisfies AuthResponse);
                }
            });
        } catch (error) {
            console.error(`Unexpected error during account deletion (${username}):`, error);
            res.status(500).json({
                error: 'Failed to process account deletion',
                message: 'An unexpected error occurred',
            } satisfies AuthResponse);
        }
    }
}

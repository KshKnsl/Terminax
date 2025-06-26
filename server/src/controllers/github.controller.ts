import { Request, Response } from 'express';
import { UserInterface } from '../models/user';
import axios from 'axios';

export class GitHubController {
    static async getRepositories(req: Request, res: Response): Promise<void> {
        if (!req.isAuthenticated() || !req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = req.user as UserInterface;
        
        if (!user.accessToken) {
            res.status(401).json({ error: 'GitHub access token not found' });
            return;
        }

        try {
            const response = await axios.get('https://api.github.com/user/repos', {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                params: {
                    sort: 'updated',
                }
            });
            console.log('Fetched repositories:', response.data);

            res.json({
                success: true,
                repositories: response.data
            });
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'An unexpected error occurred while fetching repositories'
            });
        }
    }
}

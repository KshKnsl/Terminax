import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User, UserInterface } from '../models/user';

export default function configurePassport(): void {
  passport.serializeUser((user: UserInterface, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/auth/github/callback',
    scope: ['user:email']
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      console.info(`GitHub auth for user ${JSON.stringify(profile)}`);
      const userData = {
        username: profile.username,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        provider: 'github',
        githubId: profile.id
      };
      
      const user = await User.findOneAndUpdate(
        { githubId: profile.id },
        userData,
        { upsert: true, new: true }
      );
      
      return done(null, user);
    } catch (err: any) {
      console.error(`Error in GitHub auth: ${err.message}`);
      return done(err, null);
    }
  }));
}

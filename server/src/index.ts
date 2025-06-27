import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import session from 'express-session';
import passport from 'passport';
import configurePassport from './config/passport';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import gitRoutes from './routes/github'

dotenv.config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/terminax')
.then(() => console.info('Connected to MongoDB'))
.catch(err => console.error(`MongoDB connection error: ${err}`));

const app = express();

// Ensure secure cookies in production
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Add session check middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/auth') || req.path === '/') {
    return next();
  }
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No active session found' });
  }
  next();
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/users', userRoutes);
app.use('/github', gitRoutes);
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Terminax API server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});

export default app;

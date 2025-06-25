import express from 'express';
import authRoutes from './auth';
const router = express.Router();
router.use('/auth', authRoutes);
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Terminax API server' });
});
export default router;

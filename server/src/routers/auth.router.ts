import express from 'express';
import { login, logout, me, register, updatePassword, updateProfile } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.patch('/profile', requireAuth, updateProfile);
router.patch('/password', requireAuth, updatePassword);
router.post('/logout', requireAuth, logout);

export default router;

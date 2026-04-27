import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/db.util.js';
import { signAuthToken } from '../utils/auth.util.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const toSafeUser = (user: {
  id: string;
  name: string | null;
  email: string;
  role: string;
  credits: number;
  bio?: string | null;
  avatarUrl?: string | null;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  credits: user.credits,
  bio: user.bio || '',
  avatarUrl: user.avatarUrl || '',
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        settings: {
          create: {},
        },
      },
    });

    const token = signAuthToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: toSafeUser(user)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signAuthToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      message: 'Login successful',
      token,
      user: toSafeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    user: toSafeUser(user),
    settings: user.settings,
  });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const name = typeof req.body.name === 'string' ? req.body.name.trim() : undefined;
  const bio = typeof req.body.bio === 'string' ? req.body.bio.trim() : undefined;
  const avatarUrl = typeof req.body.avatarUrl === 'string' ? req.body.avatarUrl.trim() : undefined;

  const data: any = {};
  if (name !== undefined) data.name = name || null;
  if (bio !== undefined) data.bio = bio || null;
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl || null;

  const user = await (prisma.user.update as any)({
    where: { id: userId },
    data,
  });

  return res.json({ message: 'Profile updated', user: toSafeUser(user) });
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
  const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return res.json({ message: 'Password updated' });
};

export const topUpCredits = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount < 10 || amount > 5000) {
    return res.status(400).json({ message: 'Top up amount must be between $10 and $5000' });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: Math.floor(amount) } },
  });

  return res.json({
    message: 'Dummy payment completed',
    transaction: {
      id: `RR-MID-${Date.now()}`,
      provider: 'Dummy Midtrans',
      status: 'settlement',
      amount: Math.floor(amount),
    },
    user: toSafeUser(user),
  });
};

export const logout = async (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
};

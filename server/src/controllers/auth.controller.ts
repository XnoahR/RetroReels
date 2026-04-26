import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/db.util.js';
import { signAuthToken } from '../utils/auth.util.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const toSafeUser = (user: { id: string; name: string | null; email: string; role: string; credits: number }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  credits: user.credits,
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

export const logout = async (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
};

import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/async-handler';

export const authRoutes = Router();

authRoutes.post('/login', asyncHandler(login));

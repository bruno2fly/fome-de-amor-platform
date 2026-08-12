import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

type JwtPayload = {
  sub: string;
  role: 'leader' | 'admin';
  email: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Autenticação obrigatória.' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

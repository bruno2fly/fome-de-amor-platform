import { NextFunction, Request, Response } from 'express';

export function requireRole(...roles: Array<'leader' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso não autorizado.' });
    }
    return next();
  };
}

import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const payload = {
    message: 'Erro interno do servidor.',
    detail: env.nodeEnv === 'production' ? undefined : error.message
  };

  res.status(500).json(payload);
}

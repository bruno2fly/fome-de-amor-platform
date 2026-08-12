import { Request, Response } from 'express';
import { env } from '../config/env';

export async function uploadFile(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo obrigatório.' });
  }

  const url = `${env.publicBaseUrl}/uploads/${req.file.filename}`;
  return res.status(201).json({
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url
    }
  });
}

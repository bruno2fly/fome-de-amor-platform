import { Request, Response } from 'express';
import { saveUploadedFile } from '../services/storage.service';

export async function uploadFile(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo obrigatório.' });
  }

  const file = await saveUploadedFile({
    buffer: req.file.buffer,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });

  return res.status(201).json({
    file
  });
}

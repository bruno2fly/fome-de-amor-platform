import { Request, Response } from 'express';
import { db } from '../config/database';

export async function listDocuments(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, title, description, category, file_url, file_size_bytes, published_at
     FROM documents
     ORDER BY published_at DESC`
  );

  res.json({ documents: result.rows });
}

export async function createDocument(req: Request, res: Response) {
  const { title, description, category = 'outros', fileUrl, fileSizeBytes = null } = req.body;
  const result = await db.query(
    `INSERT INTO documents (title, description, category, file_url, file_size_bytes, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, category, fileUrl, fileSizeBytes, req.user?.id]
  );

  res.status(201).json({ document: result.rows[0] });
}

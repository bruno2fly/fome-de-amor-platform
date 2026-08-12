import { Request, Response } from 'express';
import { db } from '../config/database';

export async function listAnnouncements(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, title, body, published_at
     FROM announcements
     WHERE status = 'published'
     ORDER BY published_at DESC`
  );

  res.json({ announcements: result.rows });
}

export async function createAnnouncement(req: Request, res: Response) {
  const { title, body, publish = false } = req.body;
  const result = await db.query(
    `INSERT INTO announcements (title, body, status, published_at, created_by)
     VALUES ($1, $2, $3, CASE WHEN $3 = 'published' THEN NOW() ELSE NULL END, $4)
     RETURNING *`,
    [title, body, publish ? 'published' : 'draft', req.user?.id]
  );

  res.status(201).json({ announcement: result.rows[0] });
}

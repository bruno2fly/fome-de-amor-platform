import { Request, Response } from 'express';
import { db } from '../config/database';

export async function listVideos(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, title, description, video_url, created_at, updated_at
     FROM videos
     ORDER BY created_at DESC`
  );

  res.json({ videos: result.rows });
}

export async function createVideo(req: Request, res: Response) {
  const { title, description = null, videoUrl } = req.body;
  const result = await db.query(
    `INSERT INTO videos (title, description, video_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, description, videoUrl]
  );

  res.status(201).json({ video: result.rows[0] });
}

export async function updateVideo(req: Request, res: Response) {
  const { title, description, videoUrl } = req.body;
  const result = await db.query(
    `UPDATE videos
     SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       video_url = COALESCE($3, video_url),
       updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, description, videoUrl, req.params.id]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: 'Vídeo não encontrado.' });
  }

  return res.json({ video: result.rows[0] });
}

export async function deleteVideo(req: Request, res: Response) {
  const result = await db.query('DELETE FROM videos WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rowCount) {
    return res.status(404).json({ message: 'Vídeo não encontrado.' });
  }

  return res.status(204).send();
}

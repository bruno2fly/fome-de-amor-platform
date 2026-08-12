import { Request, Response } from 'express';
import { db } from '../config/database';

export async function getLiveService(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, title, youtube_url, is_live, starts_at, ended_at
     FROM live_services
     ORDER BY created_at DESC
     LIMIT 1`
  );

  res.json({ live: result.rows[0] ?? null });
}

export async function listLiveServices(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, title, youtube_url, is_live, starts_at, ended_at, created_at, updated_at
     FROM live_services
     ORDER BY COALESCE(starts_at, created_at) DESC`
  );

  res.json({ liveServices: result.rows });
}

export async function updateLiveService(req: Request, res: Response) {
  const { title = 'Culto ao Vivo', youtubeUrl, isLive = false, startsAt = null, endedAt = null } = req.body;
  const result = await db.query(
    `INSERT INTO live_services (title, youtube_url, is_live, starts_at, ended_at, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, youtubeUrl, isLive, startsAt, endedAt, req.user?.id]
  );

  res.status(201).json({ live: result.rows[0] });
}

export async function patchLiveService(req: Request, res: Response) {
  const { title, youtubeUrl, isLive, startsAt, endedAt } = req.body;
  const result = await db.query(
    `UPDATE live_services
     SET
       title = COALESCE($1, title),
       youtube_url = COALESCE($2, youtube_url),
       is_live = COALESCE($3, is_live),
       starts_at = COALESCE($4, starts_at),
       ended_at = COALESCE($5, ended_at),
       updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [title, youtubeUrl, isLive, startsAt, endedAt, req.params.id]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: 'Culto não encontrado.' });
  }

  return res.json({ live: result.rows[0] });
}

export async function deleteLiveService(req: Request, res: Response) {
  const result = await db.query('DELETE FROM live_services WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rowCount) {
    return res.status(404).json({ message: 'Culto não encontrado.' });
  }

  return res.status(204).send();
}

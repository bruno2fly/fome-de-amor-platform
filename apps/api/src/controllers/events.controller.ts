import { Request, Response } from 'express';
import { db } from '../config/database';
import { slugify } from '../utils/slug';

export async function listPublicEvents(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, title, slug, description, location, starts_at, ends_at, cover_image_url, registration_enabled, signup_url
     FROM events
     WHERE visibility = 'public' AND status = 'published'
     ORDER BY starts_at ASC`
  );

  res.json({ events: result.rows });
}

export async function listAdminEvents(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, title, slug, description, location, starts_at, ends_at, cover_image_url,
            visibility, status, registration_enabled, signup_url, created_at, updated_at
     FROM events
     ORDER BY starts_at DESC`
  );

  res.json({ events: result.rows });
}

export async function listLeadershipEvents(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, title, description, location, starts_at, ends_at
     FROM events
     WHERE visibility = 'leadership' AND status = 'published'
     ORDER BY starts_at ASC`
  );

  res.json({ events: result.rows });
}

export async function createEvent(req: Request, res: Response) {
  const {
    title,
    slug,
    description,
    location,
    startsAt,
    endsAt = null,
    imageUrl = null,
    coverImageUrl = imageUrl,
    visibility = 'public',
    registrationEnabled = false,
    signupUrl = null
  } = req.body;
  const eventSlug = slug || `${slugify(title)}-${Date.now()}`;
  const result = await db.query(
    `INSERT INTO events (title, slug, description, location, starts_at, ends_at, cover_image_url,
                         visibility, registration_enabled, signup_url, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [title, eventSlug, description, location, startsAt, endsAt, coverImageUrl, visibility, registrationEnabled, signupUrl, req.user?.id]
  );

  res.status(201).json({ event: result.rows[0] });
}

export async function updateEvent(req: Request, res: Response) {
  const {
    title,
    slug,
    description,
    location,
    startsAt,
    endsAt,
    imageUrl,
    coverImageUrl = imageUrl,
    visibility,
    status,
    registrationEnabled,
    signupUrl
  } = req.body;

  const result = await db.query(
    `UPDATE events
     SET
       title = COALESCE($1, title),
       slug = COALESCE($2, slug),
       description = COALESCE($3, description),
       location = COALESCE($4, location),
       starts_at = COALESCE($5, starts_at),
       ends_at = COALESCE($6, ends_at),
       cover_image_url = COALESCE($7, cover_image_url),
       visibility = COALESCE($8, visibility),
       status = COALESCE($9, status),
       registration_enabled = COALESCE($10, registration_enabled),
       signup_url = COALESCE($11, signup_url),
       updated_at = NOW()
     WHERE id = $12
     RETURNING *`,
    [title, slug, description, location, startsAt, endsAt, coverImageUrl, visibility, status, registrationEnabled, signupUrl, req.params.id]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: 'Evento não encontrado.' });
  }

  return res.json({ event: result.rows[0] });
}

export async function deleteEvent(req: Request, res: Response) {
  const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rowCount) {
    return res.status(404).json({ message: 'Evento não encontrado.' });
  }

  return res.status(204).send();
}

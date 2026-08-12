import { Request, Response } from 'express';
import { db } from '../config/database';
import { slugify } from '../utils/slug';

async function getProjectById(id: string) {
  const result = await db.query(
    `SELECT
       p.id, p.name, p.slug, p.short_description, p.description, p.beneficiaries_count,
       p.cover_image_url, p.sort_order, p.is_active, p.created_at, p.updated_at,
       COALESCE(
         json_agg(DISTINCT jsonb_build_object('id', pp.id, 'image_url', pp.image_url, 'caption', pp.caption, 'sort_order', pp.sort_order))
         FILTER (WHERE pp.id IS NOT NULL),
         '[]'
       ) AS photos,
       COALESCE(
         json_agg(DISTINCT jsonb_build_object('id', pv.id, 'video_url', pv.video_url, 'title', pv.title, 'sort_order', pv.sort_order))
         FILTER (WHERE pv.id IS NOT NULL),
         '[]'
       ) AS videos
     FROM projects p
     LEFT JOIN project_photos pp ON pp.project_id = p.id
     LEFT JOIN project_videos pv ON pv.project_id = p.id
     WHERE p.id = $1
     GROUP BY p.id`,
    [id]
  );

  return result.rows[0];
}

export async function listProjects(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT
       p.id, p.name, p.slug, p.short_description, p.description, p.beneficiaries_count,
       p.cover_image_url, p.sort_order, p.is_active, p.created_at, p.updated_at,
       COALESCE(
         json_agg(DISTINCT jsonb_build_object('id', pp.id, 'image_url', pp.image_url, 'caption', pp.caption, 'sort_order', pp.sort_order))
         FILTER (WHERE pp.id IS NOT NULL),
         '[]'
       ) AS photos,
       COALESCE(
         json_agg(DISTINCT jsonb_build_object('id', pv.id, 'video_url', pv.video_url, 'title', pv.title, 'sort_order', pv.sort_order))
         FILTER (WHERE pv.id IS NOT NULL),
         '[]'
       ) AS videos
     FROM projects p
     LEFT JOIN project_photos pp ON pp.project_id = p.id
     LEFT JOIN project_videos pv ON pv.project_id = p.id
     WHERE p.is_active = TRUE
     GROUP BY p.id
     ORDER BY p.sort_order ASC, p.created_at DESC`
  );

  res.json({ projects: result.rows });
}

export async function listAdminProjects(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT
       p.id, p.name, p.slug, p.short_description, p.description, p.beneficiaries_count,
       p.cover_image_url, p.sort_order, p.is_active, p.created_at, p.updated_at,
       COALESCE(
         json_agg(DISTINCT jsonb_build_object('id', pp.id, 'image_url', pp.image_url, 'caption', pp.caption, 'sort_order', pp.sort_order))
         FILTER (WHERE pp.id IS NOT NULL),
         '[]'
       ) AS photos,
       COALESCE(
         json_agg(DISTINCT jsonb_build_object('id', pv.id, 'video_url', pv.video_url, 'title', pv.title, 'sort_order', pv.sort_order))
         FILTER (WHERE pv.id IS NOT NULL),
         '[]'
       ) AS videos
     FROM projects p
     LEFT JOIN project_photos pp ON pp.project_id = p.id
     LEFT JOIN project_videos pv ON pv.project_id = p.id
     GROUP BY p.id
     ORDER BY p.sort_order ASC, p.created_at DESC`
  );

  res.json({ projects: result.rows });
}

export async function createProject(req: Request, res: Response) {
  const {
    name,
    slug,
    shortDescription,
    description,
    beneficiariesCount = null,
    coverImageUrl = null,
    sortOrder = 0,
    photos = [],
    videos = []
  } = req.body;
  const projectSlug = slug || `${slugify(name)}-${Date.now()}`;

  await db.query('BEGIN');
  try {
    const result = await db.query(
      `INSERT INTO projects (name, slug, short_description, description, beneficiaries_count, cover_image_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name, projectSlug, shortDescription || description.slice(0, 140), description, beneficiariesCount, coverImageUrl, sortOrder]
    );

    const projectId = result.rows[0].id;
    for (const [index, photo] of photos.entries()) {
      await db.query(
        `INSERT INTO project_photos (project_id, image_url, caption, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [projectId, photo.imageUrl || photo.image_url || photo, photo.caption ?? null, index]
      );
    }
    for (const [index, video] of videos.entries()) {
      await db.query(
        `INSERT INTO project_videos (project_id, video_url, title, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [projectId, video.videoUrl || video.video_url || video, video.title ?? null, index]
      );
    }

    await db.query('COMMIT');
    return res.status(201).json({ project: await getProjectById(projectId) });
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

export async function updateProject(req: Request, res: Response) {
  const {
    name,
    slug,
    shortDescription,
    description,
    beneficiariesCount,
    coverImageUrl,
    sortOrder,
    isActive,
    photos,
    videos
  } = req.body;

  await db.query('BEGIN');
  try {
    const result = await db.query(
      `UPDATE projects
       SET
         name = COALESCE($1, name),
         slug = COALESCE($2, slug),
         short_description = COALESCE($3, short_description),
         description = COALESCE($4, description),
         beneficiaries_count = COALESCE($5, beneficiaries_count),
         cover_image_url = COALESCE($6, cover_image_url),
         sort_order = COALESCE($7, sort_order),
         is_active = COALESCE($8, is_active),
         updated_at = NOW()
       WHERE id = $9
       RETURNING id`,
      [name, slug, shortDescription, description, beneficiariesCount, coverImageUrl, sortOrder, isActive, req.params.id]
    );

    if (!result.rowCount) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    if (Array.isArray(photos)) {
      await db.query('DELETE FROM project_photos WHERE project_id = $1', [req.params.id]);
      for (const [index, photo] of photos.entries()) {
        await db.query(
          `INSERT INTO project_photos (project_id, image_url, caption, sort_order)
           VALUES ($1, $2, $3, $4)`,
          [req.params.id, photo.imageUrl || photo.image_url || photo, photo.caption ?? null, index]
        );
      }
    }

    if (Array.isArray(videos)) {
      await db.query('DELETE FROM project_videos WHERE project_id = $1', [req.params.id]);
      for (const [index, video] of videos.entries()) {
        await db.query(
          `INSERT INTO project_videos (project_id, video_url, title, sort_order)
           VALUES ($1, $2, $3, $4)`,
          [req.params.id, video.videoUrl || video.video_url || video, video.title ?? null, index]
        );
      }
    }

    await db.query('COMMIT');
    return res.json({ project: await getProjectById(req.params.id) });
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

export async function deleteProject(req: Request, res: Response) {
  const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rowCount) {
    return res.status(404).json({ message: 'Projeto não encontrado.' });
  }

  return res.status(204).send();
}

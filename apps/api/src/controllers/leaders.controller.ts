import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { db } from '../config/database';

export async function createLeader(req: Request, res: Response) {
  const { name, email, password, role = 'leader' } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, is_active, created_at`,
    [name, email, passwordHash, role]
  );

  res.status(201).json({ leader: result.rows[0] });
}

export async function listLeaders(_req: Request, res: Response) {
  const result = await db.query(
    `SELECT id, name, email, role, is_active, created_at
     FROM users
     WHERE role IN ('leader', 'admin')
     ORDER BY created_at DESC`
  );

  res.json({ leaders: result.rows });
}

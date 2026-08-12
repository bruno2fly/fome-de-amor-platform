import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { env } from '../config/env';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await db.query('SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !user.is_active) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '8h' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

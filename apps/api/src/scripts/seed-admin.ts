import bcrypt from 'bcryptjs';
import { db } from '../config/database';

const email = process.env.ADMIN_EMAIL ?? 'patrick@fomedeamor.com';
const password = process.env.ADMIN_PASSWORD ?? 'FomeAdmin-KOTWC13TmLCQ';

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(password, 12);

  await db.query('BEGIN');
  try {
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, 'admin', TRUE)
       ON CONFLICT (email)
       DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         role = 'admin',
         is_active = TRUE,
         updated_at = NOW()
       RETURNING id, email`,
      ['Patrick', email, passwordHash]
    );

    await db.query(
      `DELETE FROM users
       WHERE role = 'admin' AND id <> $1`,
      [result.rows[0].id]
    );

    await db.query('COMMIT');
    console.log(`Admin ready: ${email}`);
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

seedAdmin()
  .then(async () => {
    await db.end();
  })
  .catch(async (error) => {
    console.error(error);
    await db.end();
    process.exit(1);
  });

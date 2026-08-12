import fs from 'node:fs/promises';
import path from 'node:path';
import { db } from '../config/database';

async function migrate() {
  const migrationsDir = path.resolve(__dirname, '../../../../database/migrations');
  const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  for (const file of files) {
    const alreadyApplied = await db.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [file]);
    if (alreadyApplied.rowCount) {
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    await db.query('BEGIN');
    try {
      await db.query(sql);
      await db.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await db.query('COMMIT');
      console.log(`Applied ${file}`);
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }
}

migrate()
  .then(async () => {
    await db.end();
  })
  .catch(async (error) => {
    console.error(error);
    await db.end();
    process.exit(1);
  });

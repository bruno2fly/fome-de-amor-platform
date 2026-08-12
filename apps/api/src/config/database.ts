import { Pool } from 'pg';
import { env } from './env';

const isLocalDb = /localhost|127\.0\.0\.1/.test(env.databaseUrl);

export const db = new Pool({
  connectionString: env.databaseUrl,
  ssl: isLocalDb ? false : { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 8000,
  idleTimeoutMillis: 30000
});

db.on('error', (err) => {
  console.error('Unexpected Postgres pool error:', err);
});

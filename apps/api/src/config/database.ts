import { Pool } from 'pg';
import { env } from './env';

const isLocalDb = /localhost|127\.0\.0\.1/.test(env.databaseUrl);

export const db = new Pool({
  connectionString: env.databaseUrl,
  ssl: isLocalDb ? false : { rejectUnauthorized: false }
});

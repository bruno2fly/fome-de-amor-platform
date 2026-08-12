import 'dotenv/config';

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/fome_de_amor',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? 'http://localhost:4000',
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads'
};

import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { env } from './config/env';
import { db } from './config/database';
import { errorHandler } from './middleware/error-handler';
import { adminRoutes } from './routes/admin.routes';
import { authRoutes } from './routes/auth.routes';
import { leadershipRoutes } from './routes/leadership.routes';
import { publicRoutes } from './routes/public.routes';

const app = express();
const uploadPath = path.resolve(process.cwd(), env.uploadDir);
if (env.storageDriver !== 'r2') {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadPath));

app.get('/health', async (_req, res) => {
  await db.query('SELECT 1');
  res.json({ status: 'ok', service: 'fome-de-amor-api' });
});

app.use('/auth', authRoutes);
app.use('/public', publicRoutes);
app.use('/leadership', leadershipRoutes);
app.use('/admin', adminRoutes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API Fome de Amor rodando na porta ${env.port}`);
});

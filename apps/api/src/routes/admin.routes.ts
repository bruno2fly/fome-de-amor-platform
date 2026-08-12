import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { createAnnouncement } from '../controllers/announcements.controller';
import { createDocument } from '../controllers/documents.controller';
import { createEvent, deleteEvent, listAdminEvents, updateEvent } from '../controllers/events.controller';
import { createLeader, listLeaders } from '../controllers/leaders.controller';
import { deleteLiveService, listLiveServices, patchLiveService, updateLiveService } from '../controllers/live.controller';
import { createProject, deleteProject, listAdminProjects, updateProject } from '../controllers/projects.controller';
import { uploadFile } from '../controllers/uploads.controller';
import { createVideo, deleteVideo, listVideos, updateVideo } from '../controllers/videos.controller';
import { env } from '../config/env';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { asyncHandler } from '../utils/async-handler';

export const adminRoutes = Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(process.cwd(), env.uploadDir),
    filename: (_req, file, callback) => {
      const ext = path.extname(file.originalname);
      const basename = path
        .basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      callback(null, `${Date.now()}-${basename || 'arquivo'}${ext}`);
    }
  }),
  limits: {
    fileSize: 200 * 1024 * 1024
  }
});

adminRoutes.use(requireAuth, requireRole('admin'));
adminRoutes.get('/leaders', asyncHandler(listLeaders));
adminRoutes.post('/leaders', asyncHandler(createLeader));
adminRoutes.post('/upload', upload.single('file'), asyncHandler(uploadFile));
adminRoutes.get('/events', asyncHandler(listAdminEvents));
adminRoutes.post('/events', asyncHandler(createEvent));
adminRoutes.patch('/events/:id', asyncHandler(updateEvent));
adminRoutes.delete('/events/:id', asyncHandler(deleteEvent));
adminRoutes.get('/projects', asyncHandler(listAdminProjects));
adminRoutes.post('/projects', asyncHandler(createProject));
adminRoutes.patch('/projects/:id', asyncHandler(updateProject));
adminRoutes.delete('/projects/:id', asyncHandler(deleteProject));
adminRoutes.get('/live', asyncHandler(listLiveServices));
adminRoutes.post('/live', asyncHandler(updateLiveService));
adminRoutes.patch('/live/:id', asyncHandler(patchLiveService));
adminRoutes.delete('/live/:id', asyncHandler(deleteLiveService));
adminRoutes.get('/videos', asyncHandler(listVideos));
adminRoutes.post('/videos', asyncHandler(createVideo));
adminRoutes.patch('/videos/:id', asyncHandler(updateVideo));
adminRoutes.delete('/videos/:id', asyncHandler(deleteVideo));
adminRoutes.post('/announcements', asyncHandler(createAnnouncement));
adminRoutes.post('/documents', asyncHandler(createDocument));

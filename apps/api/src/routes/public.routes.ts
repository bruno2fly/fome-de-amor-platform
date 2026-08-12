import { Router } from 'express';
import { listPublicEvents } from '../controllers/events.controller';
import { getLiveService } from '../controllers/live.controller';
import { listProjects } from '../controllers/projects.controller';
import { listVideos } from '../controllers/videos.controller';
import { asyncHandler } from '../utils/async-handler';

export const publicRoutes = Router();

publicRoutes.get('/events', asyncHandler(listPublicEvents));
publicRoutes.get('/projects', asyncHandler(listProjects));
publicRoutes.get('/live', asyncHandler(getLiveService));
publicRoutes.get('/videos', asyncHandler(listVideos));

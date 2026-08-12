import { Router } from 'express';
import { listAnnouncements } from '../controllers/announcements.controller';
import { listDocuments } from '../controllers/documents.controller';
import { listLeadershipEvents } from '../controllers/events.controller';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { asyncHandler } from '../utils/async-handler';

export const leadershipRoutes = Router();

leadershipRoutes.use(requireAuth, requireRole('leader', 'admin'));
leadershipRoutes.get('/events', asyncHandler(listLeadershipEvents));
leadershipRoutes.get('/announcements', asyncHandler(listAnnouncements));
leadershipRoutes.get('/documents', asyncHandler(listDocuments));

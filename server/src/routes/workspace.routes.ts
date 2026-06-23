import {Router} from 'express';
import {createWorkspace,joinWorkspace} from '../controllers/workspace.controller';
import {authenticate} from '../middleware/auth.middleware';
import channelRoutes from './channel.routes';

const router = Router();

router.post('/', authenticate, createWorkspace);
router.post('/:workspaceId/join', authenticate, joinWorkspace);
router.use('/:workspaceId/channels', channelRoutes);

export default router;
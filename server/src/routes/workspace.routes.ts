import {Router} from 'express';
import {createWorkspace} from '../controllers/workspace.controller';
import {authenticate} from '../middleware/auth.middleware';
import channelRoutes from './channel.routes';

const router = Router();

router.post('/', authenticate, createWorkspace);
router.use('/:workspaceId/channels', channelRoutes);

export default router;
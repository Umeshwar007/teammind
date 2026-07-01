import {Router} from 'express';
import {createChannel, getChannel,deleteChannel,getMessages}from '../controllers/channel.controller';
import {authenticate} from '../middleware/auth.middleware';
import {requireRole} from '../middleware/authorize.middleware';

const router = Router({mergeParams: true});

router.post('/', authenticate, requireRole(["ADMIN" ,"MEMBER"]), createChannel);
router.get('/', authenticate, requireRole(["ADMIN" ,"MEMBER"]), getChannel);
router.delete('/:id', authenticate, requireRole(["ADMIN"]), deleteChannel);
router.get('/:channelId/messages', authenticate, requireRole(["ADMIN" ,"MEMBER"]), getMessages);
export default router;
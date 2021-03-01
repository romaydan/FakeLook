import { Router } from 'express';
import FriendsController from '../controllers/friends.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = container.get<FriendsController>(TYPES.FriendsController);
const router = Router();

router.get('/userId', controller.getUsersFriends);
router.delete('/', controller.removeFriend);

router.get('/request/:userId', controller.getUsersFriendRequests);
router.post('/request', controller.newFriendRequest);
router.put('/accept', controller.acceptfriendRequest);
router.put('/decline', controller.declinefriendRequest);

router.get('/block/:id', controller.usersBlocks);
router.patch('/block', controller.blockUser);
router.patch('/unblock', controller.unblockUser);

export default router;

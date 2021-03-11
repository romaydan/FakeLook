import { Router } from 'express';
import FriendsController from '../controllers/friends.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = container.get<FriendsController>(TYPES.FriendsController);
const router = Router();

router.get('/', controller.getUsersFriends);
router.delete('/', controller.removeFriend);

router.get('/request', controller.getUsersFriendRequests);
router.post('/request', controller.newFriendRequest);
router.patch('/request/accept', controller.acceptfriendRequest);
router.patch('/request/decline', controller.declinefriendRequest);

router.get('/blocks', controller.usersBlocks);
router.get('/blockers', controller.usersBlockers);
router.patch('/block', controller.blockUser);
router.patch('/unblock', controller.unblockUser);

export default router;

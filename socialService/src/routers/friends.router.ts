import { Router } from 'express';
import FriendsController from '../controllers/friends.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = container.get<FriendsController>(TYPES.FriendsController);
const router = Router();

router.get('/:userId', controller.getUsersFriends);
router.delete('/:userId&:friendId', controller.removeFriend);

router.get('/request/:userId', controller.getUsersFriendRequests);
router.post('/request', controller.newFriendRequest);
router.put('/accept', controller.acceptfriendRequest);
router.put('/decline', controller.declinefriendRequest);

router.get('/block/:id', controller.usersBlocks);
router.patch('/block/:userId&:blockedId', controller.blockUser);
router.patch('/unblock/:userId&:blockedId', controller.unblockUser);

export default router;

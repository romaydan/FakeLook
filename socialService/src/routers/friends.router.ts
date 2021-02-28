import { Router } from 'express';
import FriendsController from '../controllers/friends.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = container.get<FriendsController>(TYPES.FriendRequestController);
const router = Router();

router.get('/friendId', controller.getUsersFriends);
router.delete('/', controller.removeFriend);
router.post('/', controller.newFriendRequest);
router.put('/accept', controller.acceptfriendRequest);
router.put('/decline', controller.declinefriendRequest);
router.patch('/block', controller.blockUser);
router.patch('/unblock', controller.unblockUser);
router.get('/block/:id', controller.usersBlocks);

export default router;

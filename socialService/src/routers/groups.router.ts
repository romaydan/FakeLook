import { Router } from 'express';
import GroupsController from '../controllers/groups.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = container.get<GroupsController>(TYPES.GroupsController);
const router = Router();

router.get('/:groupId', controller.getGroup);
router.get('/user/:userId', controller.getUsersGroup);
router.post('/', controller.addGroup);
router.delete('/:userId&:groupId', controller.deleteGroup);
router.put('/name', controller.changeGroupName);
router.put('/addFriend', controller.addFriendToGroup);
router.put('/removeFriend', controller.remvoeFriendFromGroup);

export default router;

import { Router } from 'express';
import UserTagController from '../controllers/usertag.controller';
import container from '../ioc-container';
import TYPES from '../ioc-container/types';

const controller = container.get<UserTagController>(TYPES.UserTagController);
const router = Router();

router.post('/add', controller.addUserTagToPost);
router.delete('/delete', controller.removeUserTagFromPost);
router.get('/post/all', controller.getAllUserTagsForPost);

export default router;
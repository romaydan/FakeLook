import { Router } from 'express';
import CommentController from '../controllers/comment.controller';
import container from '../ioc-container';
import TYPES from '../ioc-container/types';

const controller = container.get<CommentController>(TYPES.CommentController);
const router = Router();

router.post('/add', controller.addComment);
router.delete('/delete', controller.removeComment);
router.put('/update', controller.updateComment);

export default router;
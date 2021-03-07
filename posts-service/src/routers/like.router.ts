import { Router } from 'express';
import LikeController from '../controllers/like.controller';
import container from '../ioc-container';
import TYPES from '../ioc-container/types';

const controller = container.get<LikeController>(TYPES.LikeController);
const router = Router();

router.post('/add', controller.addLike);
router.delete('/remove', controller.removeLike);

export default router;

import { Router } from 'express';
import TagController from '../controllers/tag.controller';
import container from '../ioc-container';
import TYPES from '../ioc-container/types';

const controller = container.get<TagController>(TYPES.TagController);
const router = Router();

router.post('/add', controller.addTag);
router.delete('/delete', controller.removeTagFromPost);
router.get('/post/all', controller.getAllPostTags);

export default router;
import { Router } from 'express';
import PostController from '../controllers/post.controller';
import container from '../ioc-container';
import TYPES from '../ioc-container/types';
import formDataParser from '../middlewares/formdata.parser';

const controller = container.get<PostController>(TYPES.PostController);
const router = Router();

router.get('/', controller.getFilteredPosts);
router.get('/user/:userId', controller.getAllUserPosts);
router.get('/:postId', controller.getPostById);

router.post('/add', formDataParser, controller.addPost);
router.put('/update', controller.updatePost);
router.delete('/delete', controller.removePost);

export default router;
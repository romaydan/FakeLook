import { Router } from 'express';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';
import validateToken from '../middleware/jwt.validation';
import UserController from '../controllers/user.controller';

const controller = container.get<UserController>(TYPES.UserController);
const router = Router();

router.get('/', controller.getUsersByIds);
router.post('/', controller.addUser);
router.get('/', controller.getUser);
router.delete('/', controller.deleteUser);
router.put('/:id', controller.updateUser);
router.get('/name', controller.getUsersByName);
export default router;

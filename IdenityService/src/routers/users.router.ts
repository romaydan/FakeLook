import { Router } from 'express';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';
import validateToken from '../middleware/jwt.validation';
import UserController from '../controllers/user.controller';

const controller = container.get<UserController>(TYPES.UserController);
const router = Router();

router.get('/all', validateToken, controller.getUsers);
router.post('/', controller.addUser);
router.get('/', validateToken, controller.getUser);
router.delete('/:id', validateToken, controller.deleteUser);
router.put('/:id', validateToken, controller.updateUser);

export default router;

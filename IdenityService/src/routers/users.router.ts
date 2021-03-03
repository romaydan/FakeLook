import { Router } from 'express';
import UsersController from '../controllers/user.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';
import validateToken from '../middleware/jwt.validation';

const controller = container.get<UsersController>(TYPES.UserController);
const router = Router();

router.get('/all', validateToken, controller.getUsers);
router.post('/', controller.addUser);
router.get('/', validateToken, controller.getUser);
router.delete('/:id', validateToken, controller.deleteUser);
router.put('/:id', validateToken, controller.updateUser);

export default router;

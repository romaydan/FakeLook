import { Router } from 'express';
import UsersController from '../controllers/user.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = container.get<UsersController>(TYPES.UserController);
const router = Router();

router.get('/', controller.getUsers);
router.post('/', controller.addUser);
router.get('/:id', controller.getUser);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateUser);

export default router;

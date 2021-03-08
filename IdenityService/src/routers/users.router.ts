import { Router } from 'express';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';
import validateToken from '../middleware/jwt.validation';
import UserController from '../controllers/user.controller';

const controller = container.get<UserController>(TYPES.UserController);
const router = Router();

router.post('/', controller.addUser);

router.use(validateToken);
router.get('/all', controller.getUsersByIds);
router.get('/', controller.getUser);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateUser);
router.get('/name/:name', controller.getUsersByName);
export default router;

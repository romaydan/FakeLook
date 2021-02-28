import express from 'express';
import { JwtValidtaionController } from '../controllers/jwt.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = container.get<JwtValidtaionController>(TYPES.JwtController);
const router = express.Router();

router.get('/validate', controller.validate);
router.get('/refresh', controller.refresh);
router.get('/logout', controller.logout);

export default router;

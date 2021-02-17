import express from 'express';
import { FakeLookAuthController } from '../controllers/fakelook-auth-controller';
import continer from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = continer.get<FakeLookAuthController>(TYPES.FakeLookAuthController);
const router = express.Router();

router.put('/reset', controller.resetPassword);
router.post('/signin', controller.signIn);
router.post('/signin', controller.signIn);

export default router;
import express from 'express';
import { FacebookAuthController } from '../controllers/facebook.auth.controller';
import container from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = container.get<FacebookAuthController>(TYPES.FacebookAuthController);
const router = express.Router();

router.get('/signin', controller.signIn);
router.get('/signup', controller.signUp);


export default router;
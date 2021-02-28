import express from 'express';
import { GoogleAuthController } from '../controllers/google.auth.controller';
import continer from '../ioc-container';
import { TYPES } from '../ioc-container/types';

const controller = continer.get<GoogleAuthController>(TYPES.GoogleAuthController);
const router = express.Router();

router.get('/signin', controller.signIn);

export default router;
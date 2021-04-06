import * as dotenv from 'dotenv';
import App from './app';
import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

import loggerMiddleware from './middleware/logger';
import router from './routers/users.router';
import validateToken from './middleware/jwt.validation';

const app = new App({
  port: 5004,
  routers: [{ path: '/api/users', router }],
  middleWares: [
    cors({
      origin: '*',
    }),
    express.json(),
    loggerMiddleware,
  ],
});

app.listen();

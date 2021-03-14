require('dotenv').config();
import App from './app';
import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';

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
    validateToken,
    express.json(),
    loggerMiddleware,
  ],
});

app.listen();

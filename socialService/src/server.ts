import express from 'express';
import cors from 'cors';
import App from './app';
import loggerMiddleware from './middleware/logger';
import groupsRouter from './routers/groups.router';
import friendsRouter from './routers/friends.router';
import jwtValidateToken from './middleware/jwt.validation';

const app = new App({
  port: 5006,
  routers: [
    { path: '/api/groups', router: groupsRouter },
    { path: '/api/friends', router: friendsRouter },
  ],
  middleWares: [
    cors({
      origin: '*',
    }),
    express.json(),
    loggerMiddleware,
  ],
});

app.listen();
//    jwtValidateToken,

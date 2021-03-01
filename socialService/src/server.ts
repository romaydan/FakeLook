import App from './app';
import express from 'express';
import loggerMiddleware from './middleware/logger';
import groupsRouter from './routers/groups.router';
import friendsRouter from './routers/friends.router';
import jwtValidateToken from './middleware/jwt.validation';

const app = new App({
  port: 5005,
  routers: [
    { path: '/api/groups', router: groupsRouter },
    { path: '/api/friends', router: friendsRouter },
  ],
  middleWares: [express.json(), loggerMiddleware],
});
// jwtValidateToken,

app.listen();

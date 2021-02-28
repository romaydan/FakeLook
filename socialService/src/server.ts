import { TYPES } from './ioc-container/types';
import { inject } from 'inversify';
import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';
import GroupsController from './controllers/groups.controller';
import groupsRouter from './routers/groups.router';
import friendsRouter from './routers/friends.router';

// import UserController from './controllers/user.controller';
// new UserController()
const app = new App({
  port: 5005,
  routers: [
    { path: '/api/groups', router: groupsRouter },
    { path: '/api/friends', router: friendsRouter },
  ],
  middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true }), loggerMiddleware],
});

app.listen();

import App from './app';

import * as bodyParser from 'body-parser';
import cors from 'cors';
import loggerMiddleware from './middleware/logger';

import UserController from './controllers/user.controller';
import router from './routers/users.router';

const app = new App({
  port: 5004,
  routes: [router],
  middleWares: [
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    loggerMiddleware,
  ],
});

app.listen();

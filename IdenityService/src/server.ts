import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

import UserController from './controllers/user.controller';

const app = new App({
  port: 5000,
  controllers: [new UserController()],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    loggerMiddleware,
  ],
});

app.listen();

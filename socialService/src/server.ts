import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

// import UserController from './controllers/user.controller';
// new UserController()
const app = new App({
  port: 5001,
  controllers: [],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    loggerMiddleware,
  ],
});

app.listen();

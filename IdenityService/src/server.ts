import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

import usersRouter from './routers/users.router';

const app = new App({
  port: 5002,
  routers: [{ path: '/api/users/', router: usersRouter }],
  middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true }), loggerMiddleware],
});

app.listen();

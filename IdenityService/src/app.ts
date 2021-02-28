import express from 'express';
import { Application } from 'express';
import sequelize from './db/data/index';
class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; middleWares: any; routes: any }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.routes);
  }
  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(routes: { forEach: (arg0: (router: any) => void) => void }) {
    routes.forEach((router) => {
      this.app.use('/api/users', router);
    });
  }

  public listen() {
    this.app.listen(this.port, async () => {
      await sequelize.sync({ force: true });
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}

export default App;

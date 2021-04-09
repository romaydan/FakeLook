import express from 'express';
import { Application } from 'express';
import sequelize from './db/index';
class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; middleWares: any; routers: any }) {
    this.app = express();
    this.port = appInit.port;
    this.middlewares(appInit.middleWares);
    this.routes(appInit.routers);
  }
  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(routers: { forEach: (arg0: (controller: any) => void) => void }) {
    routers.forEach((router) => {
      this.app.use(router.path, router.router);
    });
  }

  public listen() {
    this.app.listen(this.port, async () => {
      console.log('before db creation')
      await sequelize.sync({ force: false });
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}

export default App;

import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from '../interfaces/Icontroller';

class HomeController implements IControllerBase {
  public path = '/api/users';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', this.getUsers);
    this.router.get('/:id', this.getUser);
    this.router.delete('/:id', this.deleteUser);
    this.router.put('/:id', this.updateUser);
  }

  private getUsers = (req: Request, res: Response) => {};
  private getUser = (req: Request, res: Response) => {};
  private deleteUser = (req: Request, res: Response) => {};
  private updateUser = (req: Request, res: Response) => {};
}

export default HomeController;

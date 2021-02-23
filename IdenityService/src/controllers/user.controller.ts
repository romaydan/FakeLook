import IAddress from './../interfaces/IAddress';
import IUser from './../interfaces/IUser';
import * as express from 'express';
import { Request, Response } from 'express';
import { userInfo } from 'os';
import IControllerBase from '../interfaces/Icontroller';
import UserRepo from '../repositories/userRepostitory';
class HomeController implements IControllerBase {
  public path = '/api/users';
  public router = express.Router();
  private userRepo: UserRepo;
  constructor() {
    this.userRepo = new UserRepo();
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', this.getUsers);
    this.router.post('/', this.addUser);
    this.router.get('/:id', this.getUser);
    this.router.delete('/:id', this.deleteUser);
    this.router.put('/:id', this.updateUser);
  }

  private getUsers = async (req: Request, res: Response) => {
    const users = await this.userRepo.getUsers();
    res.status(200).send(users);
  };
  private addUser = async (req: Request, res: Response) => {
    const { user, address } = req.body;
    const newUser = await this.userRepo.addUser(user, address);
    res.send(newUser);
  };
  private getUser = async (req: Request, res: Response) => {
    try {
      const result = await this.userRepo.getUserById(req.params.id);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  private deleteUser = async (req: Request, res: Response) => {
    const result = await this.userRepo.removeUserById(req.params.id);
    result ? res.status(200).send(true) : res.status(404).send(false);
  };
  private updateUser = async (req: Request, res: Response) => {
    const { user, address } = req.body;
    const result = await this.userRepo.updateUser(req.params.id, user, address);
    console.log('result', result);
    result ? res.status(200).send(true) : res.status(404).send(false);
  };
}

export default HomeController;

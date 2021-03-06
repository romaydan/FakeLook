import { Request, Response } from 'express';
import { TYPES } from './../ioc-container/types';
import IAddress from './../interfaces/IAddress';
import IUser from './../interfaces/IUser';
import { userInfo } from 'os';
import IControllerBase from '../interfaces/Icontroller';
import UserRepo from '../models/repositories/user.repostitory';
import { inject, injectable } from 'inversify';
import IUserService from '../interfaces/user-service.interface';

@injectable()
class UsersController {
  constructor(@inject(TYPES.IUserService) private userServ: IUserService) {}

  getUsersByIds = async (req: Request, res: Response) => {
    try {
      const userIds: unknown = req.query.userIds;

      const users = await this.userServ.getUsersById(userIds as string[]);
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  addUser = async (req: Request, res: Response) => {
    try {
      const { user, address } = req.body;
      const newUser = await this.userServ.addUser(user, address);
      res.json(newUser);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const result = await this.userServ.getUserByAuthId(req['userId']);
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const result = await this.userServ.removeUserById(req.query.userId as string);
      result ? res.send('delete complete') : res.status(404).send('delete failed');
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userJson = req.query.user as string;
      const addressJson = req.query.address as string;
      const user = JSON.parse(userJson) as IUser;
      const address = JSON.parse(addressJson) as IAddress;
      const result = await this.userServ.updateUser(req.params.id, user, address);
      console.log('result', result);
      result ? res.send('update complete') : res.status(404).send('update failed');
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getUsersByName = async (req: Request, res: Response) => {
    try {
      const { name } = req.query;
      const result = await this.userServ.getUsersByName(name as string);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}

export default UsersController;

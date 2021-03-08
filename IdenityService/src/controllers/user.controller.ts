import { TYPES } from './../ioc-container/types';
import IAddress from './../interfaces/IAddress';
import IUser from './../interfaces/IUser';
import * as express from 'express';
import { Request, Response } from 'express';
import { userInfo } from 'os';
import IControllerBase from '../interfaces/Icontroller';
import UserRepo from '../repositories/user.repostitory';
import { inject, injectable } from 'inversify';
import IUserService from '../interfaces/user-service.interface';

@injectable()
class UsersController {
  constructor(@inject(TYPES.IUserService) private userServ: IUserService) {}

  getUsersByIds = async (req: Request, res: Response) => {
    try {
      const { userIds } = req.query;
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
      const result = await this.userServ.removeUserById(req.params.id);
      result ? res.send('delete complete') : res.status(404).send('delete failed');
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { user, address } = req.body.data;
      const result = await this.userServ.updateUser(req.params.id, user, address);
      console.log('result', result);
      result ? res.send('update complete') : res.status(404).send('update failed');
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getUsersByName = async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const result = await this.userServ.getUsersByName(name);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}

export default UsersController;

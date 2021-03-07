import { TYPES } from './../ioc-container/types';
import { inject, injectable } from 'inversify';

import IUserService from '../interfaces/user-service.interface';
import IUserRepository from '../interfaces/user-repository.interface';
import IAddress from '../interfaces/IAddress';
import IUser from '../interfaces/IUser';

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository)
    private usersRepo: IUserRepository
  ) {}
  getUsersByName(name: string): Promise<IUser[]> {
    return this.usersRepo.getUsersByName(name);
  }
  getUsersById(ids: string[]): Promise<IUser[]> {
    return this.usersRepo.getUsersById(ids);
  }
  getUserByAuthId(id: string): Promise<IUser> {
    return this.usersRepo.getUserByAuthId(id);
  }
  removeUserById(id: string): Promise<boolean> {
    return this.usersRepo.removeUserById(id);
  }
  addUser(user: IUser, address: IAddress): Promise<IUser> {
    return this.usersRepo.addUser(user, address);
  }
  updateUser(id: string, user: IUser, address: IAddress): Promise<boolean> {
    return this.updateUser(id, user, address);
  }
}

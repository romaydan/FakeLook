import { IUser } from '../interfaces/IUser';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../models/user.model';

class UserRepository implements IUserRepository {
  constructor() {}
  addUser(user: IUser): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  getByUserId(identifier: string): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  getUserById(id: string): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  removeUserById(userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  updateUser(user: IUser): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

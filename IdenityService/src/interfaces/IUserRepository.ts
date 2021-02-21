import { IUser } from './IUser';
export interface IUserRepository {
  addUser(user: IUser): Promise<IUser>;
  getByUserId(identifier: string): Promise<IUser>;
  getUserById(id: string): Promise<IUser>;
  removeUserById(userId: string): Promise<boolean>;
  updateUser(user: IUser): Promise<boolean>;
}

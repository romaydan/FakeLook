import IAddress from './IAddress';
import IUser from './IUser';

export default interface IUserService {
  getUsersById(id: string[]): Promise<IUser[]>;
  getUserById(id: string): Promise<IUser>;
  removeUserById(id: string): Promise<boolean>;
  addUser(user: IUser, address: IAddress): Promise<IUser>;
  updateUser(id: string, user: IUser, address: IAddress): Promise<boolean>;
}

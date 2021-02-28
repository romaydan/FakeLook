import IAddress from './IAddress';
import IUser from './IUser';
export default interface IUserRepository {
  getUsersById(userId: string[]): Promise<IUser[]>;
  addUser(user: IUser, address: IAddress): Promise<IUser>;
  getUserById(id: string): Promise<IUser>;
  removeUserById(userId: string): Promise<boolean>;
  updateUser(id: string, user: IUser, address: IAddress): Promise<boolean>;
}

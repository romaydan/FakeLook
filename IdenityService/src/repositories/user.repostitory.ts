import { injectable } from 'inversify';
import { Op } from 'sequelize';
import * as uuid from 'uuid';

import Address from '../models/address.model';
import IAddress from '../interfaces/IAddress';
import IUser from '../interfaces/IUser';
import IUserRepository from '../interfaces/user-repository.interface';
import User from '../models/user.model';

@injectable()
export default class UserRepository implements IUserRepository {
  constructor() {}
  getUsersByName(name: string): Promise<IUser[]> {
    return User.findAll({ where: { name: { [Op.like]: `%${name}%` } } });
  }
  getUsersById(userIds: string[]): Promise<IUser[]> {
    return User.findAll({ where: { Id: userIds }, include: [Address] });
  }

  async addUser(user: IUser, address: IAddress): Promise<IUser> {
    return User.create({ id: uuid.v4(), ...user, address: { id: uuid.v4(), ...address } }, { include: Address });
  }
  async getUserByAuthId(id: string): Promise<IUser> {
    const userFromDb = await User.findOne({
      where: { authId: id },
      include: [Address],
    });
    if (userFromDb === null) {
      console.log('USER NOT FOUND');
      throw new Error('user not found');
    } else {
      console.log('userFormDb', userFromDb);
      return userFromDb;
    }
  }
  async removeUserById(userId: string): Promise<boolean> {
    const user = await this.findUserbyId(userId);
    try {
      await user.destroy();
      return true;
    } catch (error) {
      throw new Error('user was not deleted');
    }
  }
  async updateUser(id: string, user: IUser, address: IAddress): Promise<boolean> {
    console.log('here');

    // const { id, firstName, lastName, birthDate } = user;
    user.address = address;
    console.log('user', user);
    const [addressRowsAffected, addresses] = await Address.update(address, {
      where: { userId: id },
    });
    const [userRowsAffected, users] = await User.update(user, {
      where: { id },
    });
    console.log('users', users);
    return addressRowsAffected + userRowsAffected > 0 ? true : false;
  }
  private async findUserbyId(id): Promise<User> {
    const userFromDb = await User.findOne({
      where: { id },
      include: [Address],
    });
    if (userFromDb === null) {
      throw new Error('user not found');
    } else {
      return userFromDb;
    }
  }
}

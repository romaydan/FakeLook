import { inject, injectable } from 'inversify';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TYPES } from '../ioc-container/types';
import { IUser, User } from '../models/user.model';
import * as uuid from 'uuid';
import 'reflect-metadata';

export interface IUserRepository {
    addUser(user: IUser): Promise<IUser>,
    getByUserIdentifier(identifier: string): Promise<IUser>,
    getUsersById(ids: string[]): Promise<IUser[]>,
    removeUserById(userId: string): Promise<boolean>,
    UpdateUser(user: IUser): Promise<boolean>
}

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(TYPES.Sequelize) private db: Sequelize) {
    }

    async addUser(user: IUser): Promise<IUser> {
        const newUser = { id: uuid.v4(), ...user };
        await User.build(newUser).save();
        return newUser;
    }

    async getByUserIdentifier(identifier: string): Promise<IUser> {
        const user: IUser = await User.findOne({
            where: {
                identifier: {
                    [Op.eq]: identifier
                }
            }
        });

        return user;
    }

    async getUsersById(ids: string[]): Promise<IUser[]> {
        const users: IUser[] = await User.findAll({
            where: {
                id: {
                    [Op.contained]: ids
                }
            }
        })

        return users;
    }

    async removeUserById(userId: string): Promise<boolean> {
        const count = await User.destroy({
            where: {
                id: {
                    [Op.eq]: userId
                }
            }
        })

        return count > 0;
    }

    async UpdateUser(user: IUser): Promise<boolean> {
        const updated = await User.update(user, {
            where: {
                id: {
                    [Op.eq]: user.id
                },
                isOAuthUser: {
                    [Op.eq]: false
                }
            }
        });

        const [count] = updated;
        return count > 0;
    }
}
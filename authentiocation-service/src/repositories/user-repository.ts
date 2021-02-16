import { inject, injectable } from 'inversify';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TYPES } from '../ioc-container/types';
import { IUser, User } from '../models/user.model';
import * as uuid from 'uuid';

export interface IUserRepository {
    addUser(user: IUser) : Promise<IUser>,
    getByEmail(email: string): Promise<IUser>,
    getUsersById(ids: string[]) : Promise<IUser[]>,
    removeUserById(userId: string): Promise<boolean>,
    UpdateUser(user: IUser): Promise<boolean>
}

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(TYPES.Sequelize) private db: Sequelize) {
        this.db.sync();
    }

    async addUser(user: IUser): Promise<IUser> {
        const newUser = { id: uuid.v4(), ...user };
        await User.build(newUser).save();
        return newUser;
    }

    async getByEmail(email: string): Promise<IUser> {
        const user: IUser = await User.findOne({
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });

        return user;
    }

    async getUsersById(ids: string[]) : Promise<IUser[]> {
        const users : IUser[] = await User.findAll({
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
                }
            }
        });

        const [count] = updated;
        return count > 0;
    }
}
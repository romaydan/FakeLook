import { inject, injectable } from 'inversify';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TYPES } from '../ioc-container/types';
import { IFakeLookUser, FakLookUser } from '../models/fakelook-user.model';
import * as uuid from 'uuid';
import 'reflect-metadata';

export interface IFakeLookUserRepository {
    addUser(user: IFakeLookUser): Promise<IFakeLookUser>,
    getByEmail(email: string): Promise<IFakeLookUser>,
    getUsersById(ids: string[]): Promise<IFakeLookUser[]>,
    removeUserById(userId: string): Promise<boolean>,
    UpdateUser(user: IFakeLookUser): Promise<boolean>
}

@injectable()
export class FakeLookUserRepository implements IFakeLookUserRepository {
    constructor(@inject(TYPES.Sequelize) private db: Sequelize) {
    }

    async addUser(user: IFakeLookUser): Promise<IFakeLookUser> {
        const newUser = { id: uuid.v4(), ...user };
        await FakLookUser.build(newUser).save();
        return newUser;
    }

    async getByEmail(email: string): Promise<IFakeLookUser> {
        const user: IFakeLookUser = await FakLookUser.findOne({
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });

        return user;
    }

    async getUsersById(ids: string[]): Promise<IFakeLookUser[]> {
        const users: IFakeLookUser[] = await FakLookUser.findAll({
            where: {
                id: {
                    [Op.contained]: ids
                }
            }
        })

        return users;
    }

    async removeUserById(userId: string): Promise<boolean> {
        const count = await FakLookUser.destroy({
            where: {
                id: {
                    [Op.eq]: userId
                }
            }
        })

        return count > 0;
    }

    async UpdateUser(user: IFakeLookUser): Promise<boolean> {
        const updated = await FakLookUser.update(user, {
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
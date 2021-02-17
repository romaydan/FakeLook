import { FacebookUser, IFacebookUser } from "../models/facebook-user.model";
import { TYPES } from '../ioc-container/types';
import { inject, injectable } from 'inversify';
import { Sequelize } from "sequelize-typescript";
import * as uuid from 'uuid';
import { Op } from 'sequelize';

export interface IFacebookUserRepository {
    addUser(user: IFacebookUser): Promise<IFacebookUser>,
    getByUserId(userId: string): Promise<IFacebookUser>,
}

@injectable()
export class FacebookUserRepository implements IFacebookUserRepository {
    constructor(@inject(TYPES.Sequelize) private db: Sequelize) {
    }

    async addUser(user: IFacebookUser): Promise<IFacebookUser> {
        const newUser = { id: uuid.v4(), ...user };
        await FacebookUser.build(newUser).save();
        return newUser;
    }

    async getByUserId(userId: string): Promise<IFacebookUser> {
        const user = await FacebookUser.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            }
        })

        return user;
    }

}
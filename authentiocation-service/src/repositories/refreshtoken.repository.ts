import { injectable } from "inversify";
import { Op } from "sequelize";
import UserError from "../errors/user.error";
import RefreshToken from "../models/refreshtoken.model";

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;

export interface IRefreshTokenRepository {
    blackListToken(token: string): Promise<boolean>
    isBlackListed(token: string): Promise<boolean>
}

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    constructor() {

    }
    async blackListToken(token: string): Promise<boolean> {
        if(!JWT_REGEX.test(token)) {
            throw new UserError('Token does not match the JWT schema!');
        }

        const rt = await RefreshToken.build({ token: token }).save();
        return !isNaN(rt.id);
    }

    async isBlackListed(token: string): Promise<boolean> {
        const rt = await RefreshToken.findOne({
            where: {
                token: {
                    [Op.eq]: token
                }
            }
        });

        return rt ? true : false;
    }
}
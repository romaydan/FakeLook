import { injectable } from "inversify";
import { Op } from "sequelize";
import RefreshToken from "../models/refreshtoken.model";

export interface IRefreshTokenRepository {
    blackListToken(token: string): Promise<boolean>
    isBlackListed(token: string): Promise<boolean>
}

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    constructor() {

    }
    async blackListToken(token: string): Promise<boolean> {
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
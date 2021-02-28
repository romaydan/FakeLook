import { inject, injectable } from "inversify";
import UserError from "../errors/user.error";
import { TYPES } from "../ioc-container/types";
import { IRefreshTokenRepository } from "../repositories/refreshtoken.repository";

export interface ITokenBlackListService {
    blackListToken(token: string): Promise<boolean>,
    isBlackedListed(token: string): Promise<boolean>
}

@injectable()
export class TokenBlackListService implements ITokenBlackListService {
    constructor(@inject(TYPES.IRefreshTokenRepository) private repository: IRefreshTokenRepository) {
        this.blackListToken = this.blackListToken.bind(this);
        this.isBlackedListed = this.isBlackedListed.bind(this);
    }

    //Adds a new refresh token to the token blacklist
    blackListToken(token: string): Promise<boolean> {
        if(!token) {
            throw new UserError('Token not provided!');
        }

        return this.repository.blackListToken(token);
    }

    //Checks if a refresh token is in the blacklist.
    isBlackedListed(token: string): Promise<boolean> {
        if(!token) {
            throw new UserError('Token not provided!');
        }

        return this.repository.isBlackListed(token);
    }
}
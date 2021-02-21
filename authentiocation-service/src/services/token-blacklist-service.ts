import { inject, injectable } from "inversify";
import UserError from "../errors/UserError";
import { TYPES } from "../ioc-container/types";
import { IRefreshTokenRepository } from "../repositories/refresh-token-repository";

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

    blackListToken(token: string): Promise<boolean> {
        if(!token) {
            throw new UserError('Token not provided!');
        }

        return this.repository.blackListToken(token);
    }

    isBlackedListed(token: string): Promise<boolean> {
        if(!token) {
            throw new UserError('Token not provided!');
        }

        return this.repository.isBlackListed(token);
    }
}
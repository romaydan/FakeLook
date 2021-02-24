import { inject, injectable } from "inversify";
import settings from '../settings';
import { OAuth2Client } from 'google-auth-library';
import { TYPES } from "../ioc-container/types";
import { IUserRepository } from "../repositories/user.repository";
import UserError from "../errors/user.error";
import  pswhasher from 'password-hash';

export interface IGoogleAuthenticationService {
    signIn(tokenId: string): Promise<string>
}

@injectable()
export class GoogleAuthenticationService {
    constructor(@inject(TYPES.IUserRepository) private repository: IUserRepository) {
    }

    async signIn(tokenId: string): Promise<string> {
        if(!tokenId) {
            throw new UserError('tokenId is empty!');
        }

        const client = new OAuth2Client(settings.googleSettings.clientId);
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: settings.googleSettings.clientId,
        });

        const payload = ticket.getPayload();

        let user = await this.repository.getByUserIdentifier(payload.email);

        if (user) return user.id;

        return await this.addGoogleUser(payload.email);
    }

    private async addGoogleUser(email: string) {
        const user = await this.repository.addUser({ identifier: email, password: pswhasher.generate(email), isOAuthUser: true });
        return user.id;
    }
}
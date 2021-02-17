import { inject, injectable } from "inversify";
import settings from '../settings';
import { OAuth2Client } from 'google-auth-library';
import * as uuid from 'uuid';
import { TYPES } from "../ioc-container/types";
import { IFakeLookUserRepository } from "../repositories/fakelook-user-repository";
import UserError from "../errors/UserError";

export interface IGoogleAuthenticationService {
    signIn(tokenId: string): Promise<string>
}

@injectable()
export class GoogleAuthenticationService {
    constructor(@inject(TYPES.IFakeLookUserRepository) private repository: IFakeLookUserRepository) {
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

        let user = await this.repository.getByEmail(payload.email);

        if (user) return user.id;

        return await this.addGoogleUser(payload.email);
    }

    private async addGoogleUser(email: string) {
        const user = await this.repository.addUser({ email, password: email+'_google-oauth-user', isEditable: false });
        return user.id;
    }
}
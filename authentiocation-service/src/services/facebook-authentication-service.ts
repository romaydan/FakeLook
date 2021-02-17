import { inject, injectable } from 'inversify';
import { TYPES } from '../ioc-container/types';
import axios from 'axios';
import UserError from '../errors/UserError';
import { IFacebookUserRepository } from '../repositories/facebook-user-repository';

export interface IFacebookAuthenticationService {
    signIn(token: string, userId: string): Promise<string>
}

@injectable()
export class FacebookAuthenticationService implements IFacebookAuthenticationService {
    constructor(@inject(TYPES.IFacebookUserRepository) private repository: IFacebookUserRepository) {
        this.signIn = this.signIn.bind(this);
        this.addFacebookUser = this.addFacebookUser.bind(this);
    }

    async signIn(token: string, userId: string): Promise<string> {
        if (!token || !userId)
            throw new UserError('access token or user id is empty!');

        const url = `https://graph.facebook.com/v2.11/${userId}?fields=id&access_token=${token}`;
        const resposnse = await axios.get(url);

        const { id } = resposnse.data;

        const user = await this.repository.getByUserId(id);
        if (user) return user.id;

        return await this.addFacebookUser(id);
    }

    private async addFacebookUser(id: string) {
        const user = await this.repository.addUser({ user_id: id });
        return user.id;
    }
}
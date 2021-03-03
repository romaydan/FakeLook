import { inject, injectable } from 'inversify';
import { TYPES } from '../ioc-container/types';
import axios from 'axios';
import UserError from '../errors/user.error';
import { IUserRepository } from '../repositories/user.repository';
import pswhasher from 'password-hash';

export interface IFacebookAuthenticationService {
    signIn(token: string, facebookId: string): Promise<string>
    signUp(token: string, facebookId: string): Promise<string>
}

@injectable()
export class FacebookAuthenticationService implements IFacebookAuthenticationService {
    constructor(@inject(TYPES.IUserRepository) private repository: IUserRepository) {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.addFacebookUser = this.addFacebookUser.bind(this);
        this.getFacebookId = this.getFacebookId.bind(this);
    }

    //Signs in a facebook user.
    //If it is the first time the user will be registered and then signed in.
    //The return values is the user's id.
    async signIn(token: string, facebookId: string): Promise<string> {
        const facebook_id = await this.getFacebookId(token, facebookId);

        const user = await this.repository.getByUserIdentifier(facebook_id);
        if (user) return user.id;

        throw new UserError('User does\'t exist!');
    }

    public async signUp(token: string, facebookId: string) {
        const facebook_id = await this.getFacebookId(token, facebookId);
        return await this.addFacebookUser(facebook_id);
    }

    private async getFacebookId(token: string, facebookId: string) {
        if (!token || !facebookId)
            throw new UserError('access token or user id is empty!');

        //facebook OAuth api url 
        const url = `https://graph.facebook.com/v2.11/${facebookId}?fields=id&access_token=${token}`;
        const resposnse = await axios.get(url);

        const { id: facebook_id } = resposnse.data;

        return facebook_id;
    }

    //Adds a new facebook user to the database.
    private async addFacebookUser(facebookId: string) {
        const user = await this.repository.addUser({
            identifier: facebookId,
            password: pswhasher.generate(facebookId),
            isOAuthUser: true
        });
        return user.id;
    }
}
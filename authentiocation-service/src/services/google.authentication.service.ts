import { inject, injectable } from "inversify";
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { TYPES } from "../ioc-container/types";
import { IUserRepository } from "../repositories/user.repository";
import UserError from "../errors/user.error";
import pswhasher from 'password-hash';

export interface IGoogleAuthenticationService {
    signIn(tokenId: string): Promise<string>,
    signUp(tokenId: string): Promise<string>,
}

@injectable()
export class GoogleAuthenticationService {
    constructor(@inject(TYPES.IUserRepository) private repository: IUserRepository) {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.addGoogleUser = this.addGoogleUser.bind(this);
        this.getPayload = this.getPayload.bind(this);
    }

    async signIn(tokenId: string): Promise<string> {

        const payload = await this.getPayload(tokenId);
        //try to find the user in the db.
        const user = await this.repository.getByUserIdentifier(payload.email);

        if (user) {
            //verifies that the user was registered as an OAuth user.
            if (user.isOAuthUser) return user.id;

            throw new UserError('This account can\'t be loged in with google authentication!');
        }

        throw new UserError('User doesn\'t exist');
    }

    async signUp(tokenId: string) {
        if (!tokenId) {
            throw new UserError('tokenId is empty!');
        }
        
        const payload = await this.getPayload(tokenId);

        if(payload) {
            return await this.addGoogleUser(payload.email);
        }
        
        throw new Error('Unable to get payload!');
    }

    private async getPayload(tokenId: string): Promise<TokenPayload> {
               //creates a google OAuth client.
               const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
               //verifies the user's token with google's service,
               //and recive a ticket with the user's data
               const ticket = await client.verifyIdToken({
                   idToken: tokenId,
                   audience: process.env.GOOGLE_CLIENT_ID,
               });
       
               //retrives the data from the ticket. 
               return ticket.getPayload();   
    }

    //adds a new google user to the database.
    private async addGoogleUser(email: string) {
        if(!email) {
            throw new UserError('email not provided!');
        }

        const user = await this.repository.addUser({
            identifier: email,
            password: pswhasher.generate(email),
            isOAuthUser: true
        });
        return user.id;
    }
}
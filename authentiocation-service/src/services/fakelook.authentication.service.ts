import 'reflect-metadata';
import { injectable, inject } from 'inversify'
import { TYPES } from "../ioc-container/types";
import { IUserRepository } from "../repositories/user.repository";
import { verify, generate } from 'password-hash';
import UserError from '../errors/user.error';

export interface IFakeLookAuthenticationService {
    signIn(email: string, password: string): Promise<string>,
    signUp(email: string, password: string, confirmPassword: string): Promise<boolean>
    resetPassword(email: string, oldPassword: string, newPassword: string, cofrimNewPassowrd: string): Promise<boolean>
}

@injectable()
export class FakeLookAuthenticationService implements IFakeLookAuthenticationService {
    constructor(@inject(TYPES.IUserRepository) private repository: IUserRepository) {
        this.resetPassword = this.resetPassword.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    async resetPassword(email: string, oldPassword: string, newPassword: string, cofrimNewPassowrd: string): Promise<boolean> {
        const user = await this.repository.getByUserIdentifier(email);

        if (!user)
            throw new UserError('Incorrect email! please check it before trying again');

        if (user.isOAuthUser)
            throw new UserError('Can not update a user registered using google or facebook');

        if (!verify(oldPassword, user.password))
            throw new UserError('The original password is incorrect! please check old password bfore tryin again!');

        if (newPassword !== cofrimNewPassowrd)
            throw new UserError('The new passwords do not match! please try again!');

        const success = await this.repository.UpdateUser({
            id: user.id,
            identifier: user.identifier,
            password: generate(newPassword),
            isOAuthUser: user.isOAuthUser
        });
        return success;
    }

    async signIn(email: string, password: string): Promise<string> {
        const user = await this.repository.getByUserIdentifier(email);
        if (!user)
            throw new UserError('SignIn unseccessful! invalid email or password!');


        if (user.isOAuthUser)
            throw new UserError('Can not sign with a user registered using facebook or google authentication!');


        if (verify(password, user.password))
            return user.id;

    }

    async signUp(email: string, password: string, confirmPassword: string): Promise<boolean> {
        if (password !== confirmPassword)
            throw new UserError('Passwords do not match! please try again!');

        const hashedPassword = generate(password);
        const newUser = await this.repository.addUser({ identifier: email, password: hashedPassword, isOAuthUser: false });
        return newUser ? true : false;
    }
}
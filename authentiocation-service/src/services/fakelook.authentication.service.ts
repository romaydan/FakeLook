import 'reflect-metadata';
import { injectable, inject } from 'inversify'
import { TYPES } from "../ioc-container/types";
import { IUserRepository } from "../repositories/user.repository";
import { verify, generate } from 'password-hash';
import UserError from '../errors/user.error';

export interface IFakeLookAuthenticationService {
    signIn(email: string, password: string): Promise<string>,
    signUp(email: string, password: string, confirmPassword: string): Promise<string>
    resetPassword(email: string, oldPassword: string, newPassword: string, cofrimNewPassowrd: string): Promise<boolean>
}

@injectable()
export class FakeLookAuthenticationService implements IFakeLookAuthenticationService {
    constructor(@inject(TYPES.IUserRepository) private repository: IUserRepository) {
        this.resetPassword = this.resetPassword.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    //Resets a users password to a new password.
    async resetPassword(email: string, oldPassword: string, newPassword: string, cofrimNewPassowrd: string): Promise<boolean> {
        const user = await this.repository.getByUserIdentifier(email);

        if (!user)
            throw new UserError('Incorrect email! please check it before trying again');

        //checks if the user is an OAuth user. If so, the user can't change his password.
        if (user.isOAuthUser)
            throw new UserError('Can not update a user registered using google or facebook');

        //varifies the given password to the one save in the db.
        if (!verify(oldPassword, user.password))
            throw new UserError('The original password is incorrect! please check old password bfore tryin again!');

        if (newPassword !== cofrimNewPassowrd)
            throw new UserError('The new passwords do not match! please try again!');

        //updates the user.
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


        //Checks if the user had registered with facebook/google OAuth services. 
        //If so, the user can't signin in the regular way. 
        if (user.isOAuthUser)
            throw new UserError('Can not sign with a user registered using facebook or google authentication!');


        //varifies that the password matches the hashed password from the db.
        if (verify(password, user.password))
            return user.id;

        throw new UserError('Passwords do not match!');
    }

    async signUp(email: string, password: string, confirmPassword: string): Promise<string> {
        if (password !== confirmPassword)
            throw new UserError('Passwords do not match! please try again!');

        //hashes the users password.
        const hashedPassword = generate(password);
        //adds the new user to the database.
        const newUser = await this.repository.addUser({ identifier: email, password: hashedPassword, isOAuthUser: false });
        return newUser.id;
    }
}
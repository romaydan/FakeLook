import 'reflect-metadata';
import { injectable, inject } from 'inversify'
import { TYPES } from "../ioc-container/types";
import { IFakeLookUserRepository } from "../repositories/fakelook-user-repository";
import * as pswHasher from 'password-hash';
import UserError from '../errors/UserError';

export interface IFakeLookAuthenticationService {
    signIn(email: string, password: string): Promise<string>,
    signUp(email: string, password: string, confirmPassword: string): Promise<boolean>
}

@injectable()
export class FakeLookAuthenticationService implements IFakeLookAuthenticationService {
    constructor(@inject(TYPES.IFakeLookUserRepository) private repository: IFakeLookUserRepository) {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    async signIn(email: string, password: string): Promise<string> {
        const user = await this.repository.getByEmail(email);
        if (user) {
            if (pswHasher.verify(password, user.password)) {
                return user.id;
            }
        }

        throw new UserError('SignIn unseccessful! invalid email or password!');
    }

    async signUp(email: string, password: string, confirmPassword: string): Promise<boolean> {
        const signedUser = await this.repository.getByEmail(email);
        if (!signedUser) {
            if (password === confirmPassword) {
                const hashedPassword = pswHasher.generate(password);
                const newUser = await this.repository.addUser({ email, password: hashedPassword, isEditable: true });
                return newUser ? true : false;
            }

            throw new UserError('Passwords do not match! please try again!');
        }

        throw new UserError('Email already taken! please try again with different email!');
    }
}
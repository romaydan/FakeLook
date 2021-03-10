import { injectable } from "inversify";
import UserError from "../errors/user.error";
import { verify } from 'password-hash';

export interface IPasswordValidator {
    verifyHashed(possword: string, hashedPassword: string): boolean;
    validatePassword(password: string): boolean | UserError;
}

@injectable()
export class PasswordValidator implements IPasswordValidator {
    private minLength = 8;
    private maxLength = 16;

    constructor() {
        this.validatePassword = this.validatePassword.bind(this);
        this.verifyHashed = this.verifyHashed.bind(this);
    }

    verifyHashed(possword: string, hashedPassword: string): boolean {
        return verify(possword, hashedPassword);
    }
    validatePassword(password: string): boolean | UserError {
        if(!password) {
            throw new UserError('Password not provided!');
        }

        if(password.length >= this.minLength && password.length <= this.maxLength) {
            return true;
        }

        throw new UserError('Password did not pass validation!');
    }

}
import { injectable } from "inversify";
import UserError from "../errors/user.error";

export interface IEmailValidator {
    validate(email: string): boolean | UserError
}

@injectable()
export class EmailValidator implements IEmailValidator {
    private emailRgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    constructor() {
        this.validate = this.validate.bind(this);
    }

    //Validates email format.
    validate(email: string): boolean | UserError {
        const success = this.emailRgx.test(email);

        if (!success) {
            throw new UserError('Invalid email!');
        }

        return true;
    }

}
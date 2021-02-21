import { injectable } from "inversify";
import UserError from "../errors/UserError";

export interface IEmailValidator {
    validate(email: string): boolean | UserError
}

@injectable()
export class EmailValidator implements IEmailValidator {
    private emailRgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    constructor() {
        this.validate = this.validate.bind(this);
    }

    validate(email: string): boolean | UserError {
        const success = this.emailRgx.test(email);

        if (!success) {
            throw new UserError('Invalid email!');
        }

        return true;
    }

}
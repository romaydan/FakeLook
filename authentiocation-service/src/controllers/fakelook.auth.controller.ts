"use strict";
import { IJwtService } from "../services/jwt.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc-container/types";
import { IFakeLookAuthenticationService } from "../services/fakelook.authentication.service";
import { Request, Response, NextFunction } from 'express'
import UserError from "../errors/user.error";
import settings from "../settings";
import { IEmailValidator } from "../services/emailvalidator";

@injectable()
export class FakeLookAuthController {

    constructor(@inject(TYPES.IFakeLookAuthenticationService) private service: IFakeLookAuthenticationService,
        @inject(TYPES.IJwtService) private jwtService: IJwtService,
        @inject(TYPES.IEmailValidator) private emailValidator: IEmailValidator) {

        this.resetPassword = this.resetPassword.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

            this.validateEmail(email);

            const success = await this.service.resetPassword(email, oldPassword, newPassword, confirmNewPassword);
            if (success) {
                res.json({ statusCode: 200, message: 'Password reset was successfull!' });
                return;
            }

            res.status(500).json({ statusCode: 500, error: 'Reset unsuccessfull, please try again later!' });

        } catch (error) {
            switch (true) {
                case error instanceof UserError:
                    res.status(400).json({ statusCode: 400, error: error.message });
                    break;
                default:
                    res.status(500).json({ statusCode: 500, error: 'Unable to proccess request at this time please try again later!' });
                    break;
            }
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            this.validateEmail(email);

            const userId = await this.service.signIn(email, password);
            const accessToken = this.jwtService.signToken({ userId: userId }, settings.jwtSettings.accessToken.expiration);
            const refreshToken = this.jwtService.signToken({ userId: userId }, settings.jwtSettings.refreshToken.expiration);

            res.cookie('refresh_token', refreshToken);
            res.json({ status: 200, message: 'Signup successfull!', accessToken: accessToken });

        } catch (error) {
            switch (true) {
                case error instanceof UserError:
                    res.status(400).json({ statusCode: 400, error: error.message });
                    break;
                default:
                    res.status(500).json({ statusCode: 500, error: 'Unable to proccess request at this time please try again later!' });
                    break;
            }
        }
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, confirmPassword } = req.body;

            this.validateEmail(email);

            const success = await this.service.signUp(email, password, confirmPassword);
            if (success) {
                res.json({ status: 200, message: 'Signup successfull!' });
                return;
            }

            res.status(500).json({ status: 500, error: 'Unable to proccess request at this time please try again later!' });

        } catch (error) {
            switch (true) {
                case error instanceof UserError:
                    res.status(400).json({ statusCode: 400, error: error.message });
                    break;
                default:
                    res.status(500).json({ statusCode: 500, error: 'Unable to proccess request at this time please try again later!' });
                    break;
            }
        }
    }

    private validateEmail(email: string): boolean | UserError {
        return this.emailValidator.validate(email);
    }
}
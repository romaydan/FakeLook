"use strict";
import { IJwtService } from "../services/jwt-service";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc-container/types";
import { IFakeLookAuthenticationService } from "../services/fakelook-authentication-service";
import { Request, Response, NextFunction } from 'express'
import UserError from "../errors/UserError";

@injectable()
export class FakeLookAuthController {
    constructor(@inject(TYPES.IFakeLookAuthenticationService) private service: IFakeLookAuthenticationService,
        @inject(TYPES.IJwtService) private jwtService: IJwtService) {
        this.resetPassword = this.resetPassword.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

            const success = await this.service.resetPassword(email, oldPassword, newPassword, confirmNewPassword);

            if(success) {
                res.json({statusCode: 200, message: 'Password change was successfull!'})
            } else {
                res.status(500).json({ statusCode: 500, error: 'Update unsuccessfull, please try again later!' });
            }

        } catch (error) {
            if (error instanceof UserError)
            res.status(400).json({ statusCode: 400, error: error.message });
        else
            res.status(500).json({ statusCode: 500, error: 'Unable to proccess request at this time please try again later!' });
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const userId = await this.service.signIn(email, password);
            const token = this.jwtService.signToken({ userId: userId });

            res.cookie('access_token', token);
            res.json({ status: 200, message: 'Sign in successfull!' });

        } catch (error) {
            if (error instanceof UserError)
                res.status(400).json({ statusCode: 400, error: error.message });
            else
                res.status(500).json({ statusCode: 500, error: 'Unable to proccess request at this time please try again later!' });
        }
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, confirmPassword } = req.body;

            const success = await this.service.signUp(email, password, confirmPassword);

            if (success) {
                res.json({ status: 200, message: 'Sign in successfull!' });
            } else {
                res.status(500).json({ status: 500, error: 'Unable to proccess request at this time please try again later!' });
            }

        } catch (error) {
            if (error instanceof UserError)
                res.status(400).json({ statusCode: 400, error: error.message });
            else
                res.status(500).json({ statusCode: 500, error: 'Unable to proccess request at this time please try again later!' });
        }
    }
}
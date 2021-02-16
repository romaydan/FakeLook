"use strict";

import { inject, injectable } from "inversify";
import { TYPES } from "../ioc-container/types";
import { IFakeLookAuthenticationService } from "../services/fakelook-authentication-service";
import { Request, Response, NextFunction } from 'express'
import UserError from "../errors/UserError";

@injectable()
export class FakeLookAuthController {
    constructor(@inject(TYPES.IFakeLookAuthenticationService) private service: IFakeLookAuthenticationService) {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const token = await this.service.signIn(email, password);

            res.cookie('token', token);
            res.status(200).send('sign in successful');
        } catch (error) {
            if (error instanceof UserError)
                res.status(400).send(error.message);
            else
                res.status(500).send('Unable to proccess request at this time please try again later!');
        }
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, confirmPassword } = req.body;
            const success = await this.service.signUp(email, password, confirmPassword);
            if (success) {
                res.send('sign up was successful');
            }

        } catch (error) {
            if (error instanceof UserError)
                res.status(400).send(error.message);
            else
                res.status(500).send('Unable to proccess request at this time please try again later!');
        }
    }
}
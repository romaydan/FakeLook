import { inject, injectable } from "inversify";
import { TYPES } from '../ioc-container/types';
import { IGoogleAuthenticationService } from "../services/google-authentication-service";
import { Request, Response, NextFunction } from 'express';
import { IJwtService } from "../services/jwt-service";

@injectable()
export class GoogleAuthController {
    constructor(@inject(TYPES.IGoogleAuthenticationService) private service: IGoogleAuthenticationService,
    @inject(TYPES.IJwtService) private jwt : IJwtService) {
        this.signIn = this.signIn.bind(this);
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { token_id } = req.headers;
            const userId = await this.service.signIn(token_id as string);
            const token = this.jwt.signToken({ id: userId });

            res.cookie('access_token', token);
            res.status(200).end();
        } catch (error) {
            res.status(400).send(error);
        }
    }
}
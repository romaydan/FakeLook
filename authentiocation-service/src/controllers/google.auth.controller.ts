import { inject, injectable } from "inversify";
import { TYPES } from '../ioc-container/types';
import { IGoogleAuthenticationService } from "../services/google.authentication.service";
import { Request, Response, NextFunction } from 'express';
import settings from '../settings';
import { IJwtService } from "../services/jwt.service";

@injectable()
export class GoogleAuthController {
    constructor(@inject(TYPES.IGoogleAuthenticationService) private service: IGoogleAuthenticationService,
        @inject(TYPES.IJwtService) private jwt: IJwtService) {
        this.signIn = this.signIn.bind(this);
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { token_id } = req.headers;
            const userId = await this.service.signIn(token_id as string);

            const accessToken = this.jwt.signToken({ id: userId }, settings.jwtSettings.accessToken.expiration);
            const refreshToken = this.jwt.signToken({ id: userId }, settings.jwtSettings.refreshToken.expiration);

            res.cookie('refresh_token', refreshToken);
            res.json({ status: 200, message: 'Sign in successfull!', accessToken: accessToken });

        } catch (error) {
            if (error instanceof Error)
                res.status(400).json({ statusCode: 400, error: error.message });
            else {
                res.status(400).json({ statusCode: 400, error: error });
            }
        }
    }
}
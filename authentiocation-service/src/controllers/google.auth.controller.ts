import { inject, injectable } from "inversify";
import { TYPES } from '../ioc-container/types';
import { IGoogleAuthenticationService } from "../services/google.authentication.service";
import { Request, Response, NextFunction } from 'express';
import settings from '../settings';
import { IJwtService } from "../services/jwt.service";
import { ILogger } from "../services/logger.service";

@injectable()
export class GoogleAuthController {
    constructor(@inject(TYPES.IGoogleAuthenticationService) private service: IGoogleAuthenticationService,
        @inject(TYPES.IJwtService) private jwt: IJwtService,
        @inject(TYPES.ILogger) private logger: ILogger) {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.onErrorRespone = this.onErrorRespone.bind(this);
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { token_id } = req.headers;
            const userId = await this.service.signIn(token_id as string);

            //generates an access token with the user id.
            const accessToken = this.jwt.signToken({ userId }, settings.jwtSettings.accessToken.expiration);
            //generates a refresh token with the user id.
            const refreshToken = this.jwt.signToken({ userId }, settings.jwtSettings.refreshToken.expiration);

            res.json({ status: 200, message: 'Sign in successfull!', accessToken, refreshToken });

            this.logger.log({ userId, action: 'google signIn', status: 'successfull' });

        } catch (error) {
            this.onErrorRespone(res, error, 'google signIn');
        }
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { token_id } = req.body;
            const userId = await this.service.signUp(token_id as string);

            if (userId) {
                res.json({ statusCode: 201, message: 'Signup successfull!', userId });
                this.logger.log({ userId, action: 'google signUp', status: 'successfull' });

                return;
            }

            this.logger.error({ action: 'google signUp', status: 'unsuccessfull', error: 'internal server error' });

        } catch (error) {
            this.onErrorRespone(res, error, 'google signUp')
        }
    }

    private onErrorRespone(res: Response, error: any, action: string) {
        const errorLog: any = { action, status: 'unsuccessfull' };

        if (error instanceof Error) {
            res.status(400).json({ statusCode: 400, error: error.message });
            errorLog.error = error.message;
        } else {
            res.status(400).json({ statusCode: 400, error: error });
            errorLog.error = error;
        }

        this.logger.error(errorLog);
    }
}
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from 'express';
import { TYPES } from "../ioc-container/types";
import { IFacebookAuthenticationService } from "../services/facebook.authentication.service";
import { IJwtService } from "../services/jwt.service";
import settings from "../settings";
import { ILogger } from "../services/logger.service";

@injectable()
export class FacebookAuthController {
    constructor(@inject(TYPES.IFacebookAuthenticationService) private service: IFacebookAuthenticationService,
        @inject(TYPES.IJwtService) private jwt: IJwtService,
        @inject(TYPES.ILogger) private logger: ILogger) {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.onErrorResponse = this.onErrorResponse.bind(this);
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { facebook_token, facebook_id } = req.headers;

            const userId = await this.service.signIn(facebook_token as string, facebook_id as string);
            //generates an access token with the user id.
            const accessToken = this.jwt.signToken({ userId }, settings.jwtSettings.accessToken.expiration);
            //generates a refresh token with the user id.
            const refreshToken = this.jwt.signToken({ userId }, settings.jwtSettings.refreshToken.expiration);

            res.json({ status: 200, message: 'Sign in successfull!', accessToken, refreshToken });

            this.logger.log({ userId: userId, action: 'facebook signIn', status: 'successfull' });

        } catch (error) {
            this.onErrorResponse(res, error, 'facebook signIn');
        }
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { facebook_token, facebook_id } = req.body;

            const userId = await this.service.signUp(facebook_token as string, facebook_id as string);

            res.json({ statusCode: 201, message: 'Signup successfull!', userId });

            this.logger.log({ userId: userId, action: 'facebook signUp', status: 'successfull' });

        } catch (error) {
            this.onErrorResponse(res, error, 'facebook signUp');
        }
    }

    private onErrorResponse(res: Response, error: any, action: string): void {
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
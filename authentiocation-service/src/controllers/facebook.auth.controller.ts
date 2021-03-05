import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from 'express';
import { TYPES } from "../ioc-container/types";
import { IFacebookAuthenticationService } from "../services/facebook.authentication.service";
import { IJwtService } from "../services/jwt.service";
import settings from "../settings";

@injectable()
export class FacebookAuthController {
    constructor(@inject(TYPES.IFacebookAuthenticationService) private service: IFacebookAuthenticationService,
        @inject(TYPES.IJwtService) private jwt: IJwtService) {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { facebook_token, facebook_id } = req.headers;

            const userId = await this.service.signIn(facebook_token as string, facebook_id as string);
            //generates an access token with the user id.
            const accessToken = this.jwt.signToken({ id: userId },settings.jwtSettings.accessToken.expiration);
            //generates a refresh token with the user id.
            const refreshToken = this.jwt.signToken({ id: userId },settings.jwtSettings.refreshToken.expiration);

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

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { facebook_token, facebook_id } = req.body;

            const userId = await this.service.signUp(facebook_token as string, facebook_id as string);
            
            res.json({ statusCode: 201, message: 'Signup successfull!', userId  });

        } catch (error) {
            if (error instanceof Error)
            res.status(400).json({ statusCode: 400, error: error.message });
        else {
            res.status(400).json({ statusCode: 400, error: error });
        }
        }
    }
}
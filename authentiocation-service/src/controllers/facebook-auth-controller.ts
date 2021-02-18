import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from 'express';
import { TYPES } from "../ioc-container/types";
import { IFacebookAuthenticationService } from "../services/facebook-authentication-service";
import { IJwtService } from "../services/jwt-service";

@injectable()
export class FacebookAuthController {
    constructor(@inject(TYPES.IFacebookAuthenticationService) private service: IFacebookAuthenticationService,
        @inject(TYPES.IJwtService) private jwt: IJwtService) {
        this.signIn = this.signIn.bind(this);
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { facebook_token, facebook_id } = req.headers;

            const userId = await this.service.signIn(facebook_token as string, facebook_id as string);
            const token = this.jwt.signToken({ id: userId });

            res.cookie('access_token', token);
            res.json({ status: 200, message: 'Sign in successfull!' });
            
        } catch (error) {
            if (error instanceof Error)
                res.status(400).json({ statusCode: 400, error: error.message });
            else {
                res.status(400).json({ statusCode: 400, error: error });
            }
        }
    }
}
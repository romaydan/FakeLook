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
            const { fb_token, user_id } = req.headers;
            
            const userId = await this.service.signIn(fb_token as string, user_id as string);
            const token = this.jwt.signToken({ id: userId });

            res.cookie('access_token', token);
            res.status(200).end();
        } catch (error) {
            res.status(400).send(error);
        }
    }
}
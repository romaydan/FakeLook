import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from 'express';
import { TYPES } from "../ioc-container/types";
import { IJwtService } from "../services/jwt.service";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import settings from "../settings";
import { ITokenBlackListService } from "../services/token.blacklist.service";
import { IUserService } from "../services/user.service";

@injectable()
export class JwtValidtaionController {
    constructor(@inject(TYPES.IJwtService) private service: IJwtService,
        @inject(TYPES.IUserService) private userService: IUserService,
        @inject(TYPES.ITokenBlackListService) private blackListService: ITokenBlackListService) {
        this.validate = this.validate.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
    }

    private clearRefreshTokenCookie(res: Response) {
        res.clearCookie('refresh_token');
    }

    //validates a JWT access token.
    async validate(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorization: token } = req.headers;

            if (!token) {
                res.status(400).json({ statusCode: 400, error: 'No token provided!' });
                return;
            }

            //verifies the token and recives its payload
            const payload = this.service.verifyToken(token);
            const user = await this.userService.getUserById(payload.userId);

            if (!user) {
                res.status(403).json({ statusCode: 403, error: 'User does not exist!' });
                return;
            }

            res.json(payload);

        } catch (error) {
            switch (true) {
                case error instanceof (TokenExpiredError):
                    res.status(400).json({ statusCode: 400, error: 'Expired token!' });
                    break;
                case error instanceof (JsonWebTokenError):
                    res.status(400).json({ statusCode: 400, error: 'Invalid token!' });
                    break;
                default:
                    res.status(500).json({ statusCode: 500, error: 'Internal error. Please try again later' })
                    break;
            }

        }
    }

    //generates a new JWT access token using a refresh token. 
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refresh_token: token } = req.cookies;

            if (!token) {
                res.status(400).json({ statusCode: 400, error: 'No token provided!' });
                return;
            }

            //checks to see if the refresh token is in the blacklist.
            if (await this.blackListService.isBlackedListed(token)) {
                this.clearRefreshTokenCookie(res);
                res.status(401).json({ statusCode: 401, error: 'This token is blacklisted!' });
                return;
            }

            //verifies the refresh token and recives its payload.
            const { userId } = this.service.verifyToken(token);
            //finds the user by the userId.
            const user = await this.userService.getUserById(userId);

            if (user) {
                //generates a new access token.
                const accessToken = this.service.signToken({ userId: userId }, settings.jwtSettings.accessToken.expiration);
                res.status(200).json({ statusCode: 200, message: 'Successfull refresh!', accessToken: accessToken });
                return;
            }

            //adds the token to the blacklist
            await this.blackListService.blackListToken(token);
            //if the user doesn't exists anymore the refresh token is cleared from the cookies.
            this.clearRefreshTokenCookie(res);
            res.status(403).json({ statusCode: 403, error: 'User does not exist!' });

        } catch (error) {
            switch (true) {
                case error instanceof (TokenExpiredError):
                    this.clearRefreshTokenCookie(res);
                    res.status(400).json({ statusCode: 400, error: 'Expired refresh token!' });
                    break;
                case error instanceof (JsonWebTokenError):
                    this.clearRefreshTokenCookie(res);
                    res.status(400).json({ statusCode: 400, error: 'Invalid refresh token!' });
                    break;
                default:
                    res.status(500).json({ statusCode: 500, error: 'Internal error. Please try again later' })
                    break;
            }
        }

    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refresh_token: token } = req.cookies;

            //adds the refresh token to the blacklist.
            const success = await this.blackListService.blackListToken(token);
            //clears the token from the user's cookies.
            this.clearRefreshTokenCookie(res);

            if (success) {
                res.status(200).json({ statusCode: 200, message: 'Logged out successfully!' });
                return;
            }

            res.status(500).json({ statusCode: 500, message: 'Unable to black list refresh token!' });

        } catch (error) {
            this.clearRefreshTokenCookie(res);
            res.status(400).json({ statusCode: 400, error: error.message });
        }
    }
}
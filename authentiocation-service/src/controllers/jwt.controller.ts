import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from 'express';
import { TYPES } from "../ioc-container/types";
import { IJwtService } from "../services/jwt.service";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import settings from "../settings";
import { ITokenBlackListService } from "../services/token.blacklist.service";
import { IUserService } from "../services/user.service";
import { ILogger } from "../services/logger.service";

@injectable()
export class JwtValidtaionController {
    constructor(@inject(TYPES.IJwtService) private service: IJwtService,
        @inject(TYPES.IUserService) private userService: IUserService,
        @inject(TYPES.ITokenBlackListService) private blackListService: ITokenBlackListService,
        @inject(TYPES.ILogger) private logger: ILogger) {
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
                this.logger.log({ accessToken: token, action: 'validate token', status: 'unsuccessfull', reason: 'user does not exist' })
                return;
            }

            res.json({ userId: payload.userId, exp: payload.exp, iat: payload.iat });

        } catch (error) {
            const { authorization: token } = req.headers;

            switch (true) {
                case error instanceof (TokenExpiredError):
                    res.status(401).json({ statusCode: 401, error: 'Expired token!' });
                    this.logger.log({ accessToken: token, action: 'validate token', status: 'unsuccessfull', reason: 'expired token' })
                    break;
                case error instanceof (JsonWebTokenError):
                    res.status(403).json({ statusCode: 403, error: 'Invalid token!' });
                    this.logger.log({ accessToken: token, action: 'validate token', status: 'unsuccessfull', reason: 'invalid token' })
                    break;
                default:
                    res.status(500).json({ statusCode: 500, error: 'Internal error. Please try again later' });
                    this.logger.error({ accessToken: token, action: 'validate token', status: 'unsuccessfull', error: 'internal server error' });
                    break;
            }
        }
    }

    //generates a new JWT access token using a refresh token. 
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refresh_token: token } = req.headers;

            if (!token) {
                res.status(400).json({ statusCode: 400, error: 'No token provided!' });
                return;
            }

            //checks to see if the refresh token is in the blacklist.
            if (await this.blackListService.isBlackedListed(<string>token)) {
                this.clearRefreshTokenCookie(res);
                res.status(401).json({ statusCode: 401, error: 'This token is blacklisted!' });

                this.logger.log({ refreshToken: token, action: 'refresh', status: 'unsuccessfull', reason: 'blacklisted refresh token' });

                return;
            }

            //verifies the refresh token and recives its payload.
            const { userId } = this.service.verifyToken(<string>token);
            //finds the user by the userId.
            const user = await this.userService.getUserById(userId);

            if (user) {
                //generates a new access token.
                const accessToken = this.service.signToken({ userId: userId }, settings.jwtSettings.accessToken.expiration);

                res.status(200).json({ statusCode: 200, message: 'Successfull refresh!', accessToken: accessToken });
                this.logger.log({ userId: user.id, action: 'refresh token', status: 'successfull' });

                return;
            }

            //adds the token to the blacklist
            await this.blackListService.blackListToken(<string>token);
            //if the user doesn't exists anymore the refresh token is cleared from the cookies.
            this.clearRefreshTokenCookie(res);
            res.status(403).json({ statusCode: 403, error: 'User does not exist!' });

            this.logger.log({ refreshToken: token, action: 'refresh token', status: 'unsuccessfull', reason: 'blacklisted refresh token' });

        } catch (error) {
            const { refresh_token: token } = req.headers;

            switch (true) {
                case error instanceof (TokenExpiredError):
                    this.clearRefreshTokenCookie(res);
                    res.status(400).json({ statusCode: 400, error: 'Expired refresh token!' });
                    this.logger.log({ refreshToken: token, action: 'refresh token', status: 'unsuccessfull', reason: 'expired token' })
                    break;
                case error instanceof (JsonWebTokenError):
                    this.clearRefreshTokenCookie(res);
                    res.status(400).json({ statusCode: 400, error: 'Invalid refresh token!' });
                    this.logger.log({ refreshToken: token, action: 'refresh token', status: 'unsuccessfull', reason: 'invalid token' })
                    break;
                default:
                    res.status(500).json({ statusCode: 500, error: 'Internal error. Please try again later' })
                    this.logger.error({ refreshToken: token, action: 'refresh token', status: 'unsuccessfull', error: 'internal server error' });
                    break;
            }
        }

    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refresh_token: token } = req.headers;

            //adds the refresh token to the blacklist.
            const success = await this.blackListService.blackListToken(<string>token);
            //clears the token from the user's cookies.
            this.clearRefreshTokenCookie(res);

            if (success) {
                res.status(200).json({ statusCode: 200, message: 'Logged out successfully!' });
                this.logger.log({ refreshToken: token, action: 'logout', status: 'successfull' });

                return;
            }

            res.status(500).json({ statusCode: 500, message: 'Unable to black list refresh token!' });
            this.logger.error({ refreshToken: token, action: 'logout', status: 'unsuccessfull', error: 'internal server error' });

        } catch (error) {
            const { refresh_token: token } = req.headers;

            this.clearRefreshTokenCookie(res);
            res.status(400).json({ statusCode: 400, error: error.message });

            this.logger.error({ refreshToken: token, action: 'logout', status: 'unsuccessfull', error: error.message });
        }
    }
}
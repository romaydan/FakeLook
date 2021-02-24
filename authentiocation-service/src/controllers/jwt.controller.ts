import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from 'express';
import { TYPES } from "../ioc-container/types";
import { IJwtService } from "../services/jwt.service";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { IUserRepository } from "../repositories/user.repository";
import settings from "../settings";
import { ITokenBlackListService } from "../services/token.blacklist.service";

@injectable()
export class JwtValidtaionController {
    constructor(@inject(TYPES.IJwtService) private service: IJwtService,
        @inject(TYPES.IUserRepository) private userRepostiroy: IUserRepository,
        @inject(TYPES.ITokenBlackListService) private blackListService: ITokenBlackListService) {
        this.validate = this.validate.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
    }

    private clearRefreshTokenCookie(res: Response) {
        res.clearCookie('refresh_token');
    }

    async validate(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorization: token } = req.headers;

            if (!token) {
                res.status(400).json({ statusCode: 400, error: 'No token provided!' });
            }

            const payload = this.service.verifyToken(token);
            const user = await this.userRepostiroy.getUserById(payload.userId);

            if (!user) {
                res.status(403).json({ statusCode: 403, error: 'User does not exist!' });
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

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refresh_token: token } = req.cookies;

            if (!token) {
                res.status(400).json({ statusCode: 400, error: 'No token provided!' });
                return;
            }

            if (await this.blackListService.isBlackedListed(token)) {
                this.clearRefreshTokenCookie(res);
                res.status(401).json({ statusCode: 401, error: 'This token is blacklisted!' });
                return;
            }

            const { userId } = this.service.verifyToken(token);
            const user = await this.userRepostiroy.getUserById(userId);

            if (user) {
                const accessToken = this.service.signToken({ userId: userId }, settings.jwtSettings.accessToken.expiration);
                res.status(200).json({ statusCode: 200, message: 'Successfull refresh!', accessToken: accessToken });
                return;
            }

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

            const success = await this.blackListService.blackListToken(token);
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
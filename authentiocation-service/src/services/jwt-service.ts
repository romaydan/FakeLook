import { sign, verify, decode } from 'jsonwebtoken';
import { injectable } from 'inversify'
import ms from 'ms';
import settings from '../settings';

export interface IJwtService {
    signToken(payload: string | Buffer | object): string,
    verifyToken(token: string): object | string,
    decode(token: string): object
}

@injectable()
export class JwtService implements IJwtService {
    constructor() {
    }

    decode(token: string): object {
        return decode(token, { json: true });
    }

    signToken(payload: string | object | Buffer): string {
        return sign(payload, settings.jwtSettings.secret, {
            expiresIn: ms(settings.jwtSettings.expiresIn)
        });
    }
    verifyToken(token: string): string | object {
        return verify(token, settings.jwtSettings.secret);
    }
}
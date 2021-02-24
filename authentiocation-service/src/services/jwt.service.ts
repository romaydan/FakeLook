import jwt, { sign, verify, decode } from 'jsonwebtoken';
import { injectable } from 'inversify'
import settings from '../settings';

export interface IJwtService {
    signToken(payload: string | Buffer | object, expiresIn: number | string): string,
    verifyToken(token: string): { userId: string, iat: number, exp: number },
    decode(token: string): object
}

@injectable()
export class JwtService implements IJwtService {
    constructor() {
    }

    decode(token: string): object {
        return decode(token, { json: true });
    }

    signToken(payload: string | object | Buffer, expiresIn: number | string): string {
        return sign(payload, settings.jwtSettings.secret, {
            expiresIn: expiresIn,
            mutatePayload: true
        });
    }
    verifyToken(token: string): { userId: string, iat: number, exp: number } {
        return verify(token, settings.jwtSettings.secret, {
            ignoreExpiration: false,
            ignoreNotBefore: false
        }) as any;
    }
}
import { Secret, sign, SignOptions, verify } from 'jsonwebtoken';
import { injectable} from 'inversify'
import settings from '../settings';

export interface IJwtService {
    signToken(payload: string | Buffer | object) : string,
    verifyToken(token: string): object | string
}

@injectable()
export class JwtService implements IJwtService {
    constructor() {       
    }
    
    signToken(payload: string | object | Buffer): string {
        return sign(payload, settings.jwtSettings.secret, {
            expiresIn: settings.jwtSettings.expiresIn
        });
    }
    verifyToken(token: string): string | object {
        return verify(token, settings.jwtSettings.secret);
    }
}
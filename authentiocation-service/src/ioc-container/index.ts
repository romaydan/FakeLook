import { FakeLookAuthenticationService, IFakeLookAuthenticationService } from '../services/fakelook.authentication.service';
import { GoogleAuthenticationService, IGoogleAuthenticationService } from '../services/google.authentication.service';
import { FacebookAuthenticationService, IFacebookAuthenticationService } from '../services/facebook.authentication.service';
import { JwtValidtaionController as JwtController } from '../controllers/jwt.controller';
import { IRefreshTokenRepository, RefreshTokenRepository } from '../repositories/refreshtoken.repository';
import { ITokenBlackListService, TokenBlackListService } from '../services/token.blacklist.service';
import { FakeLookAuthController } from '../controllers/fakelook.auth.controller';
import { GoogleAuthController } from '../controllers/google.auth.controller';
import { FacebookAuthController } from '../controllers/facebook.auth.controller';
import { IUserRepository, UserRepository } from '../repositories/user.repository';
import { IJwtService, JwtService } from '../services/jwt.service';
import { Container } from 'inversify';
import { Sequelize } from 'sequelize-typescript';
import { TYPES } from './types';
import db from '../db';
import "reflect-metadata"
import { EmailValidator, IEmailValidator } from '../services/emailvalidator';
import { IUserService, UserService } from '../services/user.service';
import { IPasswordValidator, PasswordValidator } from '../services/password.validator';
import { ILogger, RedisPubSubLogger } from '../services/logger.service';

const container = new Container();

//services
container.bind<IFakeLookAuthenticationService>(TYPES.IFakeLookAuthenticationService).to(FakeLookAuthenticationService).inSingletonScope();
container.bind<IGoogleAuthenticationService>(TYPES.IGoogleAuthenticationService).to(GoogleAuthenticationService).inSingletonScope();
container.bind<IFacebookAuthenticationService>(TYPES.IFacebookAuthenticationService).to(FacebookAuthenticationService).inSingletonScope();
container.bind<IJwtService>(TYPES.IJwtService).to(JwtService).inSingletonScope();
container.bind<ITokenBlackListService>(TYPES.ITokenBlackListService).to(TokenBlackListService).inSingletonScope();
container.bind<IEmailValidator>(TYPES.IEmailValidator).to(EmailValidator).inSingletonScope();
container.bind<IPasswordValidator>(TYPES.IPasswordValidator).to(PasswordValidator).inSingletonScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
container.bind<ILogger>(TYPES.ILogger).to(RedisPubSubLogger).inSingletonScope();

//db
container.bind<Sequelize>(TYPES.Sequelize).toDynamicValue(() => db).inSingletonScope();

//repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).to(RefreshTokenRepository).inSingletonScope();

//controllers
container.bind<FakeLookAuthController>(TYPES.FakeLookAuthController).to(FakeLookAuthController).inTransientScope();
container.bind<GoogleAuthController>(TYPES.GoogleAuthController).to(GoogleAuthController).inTransientScope();
container.bind<FacebookAuthController>(TYPES.FacebookAuthController).to(FacebookAuthController).inTransientScope();
container.bind<JwtController>(TYPES.JwtController).to(JwtController).inTransientScope();

export default container;
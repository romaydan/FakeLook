import { Container } from 'inversify';
import "reflect-metadata"
import { Sequelize } from 'sequelize-typescript';
import { FakeLookAuthController } from '../controllers/fakelook-auth-controller';
import { GoogleAuthController } from '../controllers/google-auth-controller';
import { FacebookAuthController } from '../controllers/facebook-auth-controller';
import { IUserRepository, UserRepository } from '../repositories/user-repository';
import { FakeLookAuthenticationService, IFakeLookAuthenticationService } from '../services/fakelook-authentication-service';
import { GoogleAuthenticationService, IGoogleAuthenticationService } from '../services/google-authentication-service';
import { FacebookAuthenticationService, IFacebookAuthenticationService } from '../services/facebook-authentication-service';
import { IJwtService, JwtService } from '../services/jwt-service';
import { TYPES } from './types';
import db from '../db';




const container = new Container();

//services
container.bind<IFakeLookAuthenticationService>(TYPES.IFakeLookAuthenticationService).to(FakeLookAuthenticationService).inSingletonScope();
container.bind<IGoogleAuthenticationService>(TYPES.IGoogleAuthenticationService).to(GoogleAuthenticationService).inSingletonScope();
container.bind<IFacebookAuthenticationService>(TYPES.IFacebookAuthenticationService).to(FacebookAuthenticationService).inSingletonScope();
container.bind<IJwtService>(TYPES.IJwtService).to(JwtService).inSingletonScope();

//db
container.bind<Sequelize>(TYPES.Sequelize).toDynamicValue(() => db).inSingletonScope();

//repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();

//controllers
container.bind<FakeLookAuthController>(TYPES.FakeLookAuthController).to(FakeLookAuthController).inTransientScope();
container.bind<GoogleAuthController>(TYPES.GoogleAuthController).to(GoogleAuthController).inTransientScope();
container.bind<FacebookAuthController>(TYPES.FacebookAuthController).to(FacebookAuthController).inTransientScope();

export default container;
import { Container } from 'inversify';
import "reflect-metadata"
import { Sequelize } from 'sequelize-typescript';
import { FakeLookAuthController } from '../controllers/fakelook-auth-controller';
import db from '../db';
import { IUserRepository, UserRepository } from '../repositories/user-repository';
import { FakeLookAuthenticationService, IFakeLookAuthenticationService } from '../services/fakelook-authentication-service';
import { IJwtService, JwtService } from '../services/jwt-service';
import { TYPES } from './types';




const container = new Container();

//services
container.bind<IFakeLookAuthenticationService>(TYPES.IFakeLookAuthenticationService).to(FakeLookAuthenticationService).inSingletonScope();
container.bind<IJwtService>(TYPES.IJwtService).to(JwtService).inSingletonScope();

//db
container.bind<Sequelize>(TYPES.Sequelize).toDynamicValue(() => db).inSingletonScope();

//repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();

//controllers
container.bind<FakeLookAuthController>(TYPES.FakeLookAuthController).to(FakeLookAuthController).inTransientScope();

export default container;
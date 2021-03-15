import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import UsersController from '../controllers/user.controller';
import IUserRepository from '../interfaces/user-repository.interface';
import UserRepository from '../models/repositories/user.repostitory';
import IUserService from '../interfaces/user-service.interface';
import UserService from '../services/user.service';

const container = new Container();
//controllers
container.bind<UsersController>(TYPES.UserController).to(UsersController).inTransientScope();

//services
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();

export default container;

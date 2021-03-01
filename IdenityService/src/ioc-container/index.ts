import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import UsersController from '../controllers/user.controller';
import IUserRepository from '../interfaces/user-repository.interface';
import IUserService from '../interfaces/user-service.interface';
import UserService from '../services/user.service';
import UserRepository from '../repositories/user.repostitory';
const container = new Container();
//controllers
container.bind<UsersController>(TYPES.UserController).to(UsersController).inTransientScope();

//services
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();

//repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();

export default container;

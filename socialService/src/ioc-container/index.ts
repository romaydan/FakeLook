import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import FriendRequestService from '../services/friend-request.service';
import FriendRequestRepositorySequelize from './../repositories/friend-requests.repository';
import IFriendRequestRepository from '../interfaces/repositories/friend-request-repository.interface';
import IFriendRequestService from '../interfaces/services/friend-request-service.interface';
import IFriendsRepository from '../interfaces/repositories/friends-repository.interaface';
import FriendsService from '../services/friends.service';
import IFriendsService from '../interfaces/services/friend-service.interface';
import FriendsRepositorySequelize from '../repositories/friends.repository';
import IBlockUserRepository from '../interfaces/repositories/user-block-repository.interface';
import BlockUserRepositorySequelize from '../repositories/block-user.repository';
import BlockUserService from '../services/block-user.service';
import IBlockUserService from '../interfaces/services/user-block-service.interface';
import IGroupsRepository from '../interfaces/repositories/group-repository.interafce';
import IGroupsService from '../interfaces/services/groups-service.interface';
import GroupsRepositorySequelize from '../repositories/groups.repository';
import GroupsService from '../services/groups.service';
import GroupsController from '../controllers/groups.controller';
import FriendsController from '../controllers/friends.controller';

const container = new Container();
//controllers
container.bind<GroupsController>(TYPES.GroupsController).to(GroupsController).inTransientScope();
container.bind<FriendsController>(TYPES.FriendRequestController).to(FriendsController).inTransientScope();

//services
container.bind<IFriendRequestService>(TYPES.IFriendRequestService).to(FriendRequestService).inSingletonScope();
container.bind<IFriendsService>(TYPES.IFriendsService).to(FriendsService).inSingletonScope();
container.bind<IBlockUserService>(TYPES.IBlockUserService).to(BlockUserService).inSingletonScope();
container.bind<IGroupsService>(TYPES.IGroupsService).to(GroupsService).inSingletonScope();
//repositories
container.bind<IFriendRequestRepository>(TYPES.IFriendRequestRepository).to(FriendRequestRepositorySequelize).inSingletonScope();
container.bind<IFriendsRepository>(TYPES.IFriendsRepository).to(FriendsRepositorySequelize).inSingletonScope();
container.bind<IBlockUserRepository>(TYPES.IBlockUserRepository).to(BlockUserRepositorySequelize).inSingletonScope();
container.bind<IGroupsRepository>(TYPES.IGroupsRepository).to(GroupsRepositorySequelize).inSingletonScope();

export default container;

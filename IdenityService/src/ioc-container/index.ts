import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

const container = new Container();
//controllers
container.bind<IUSer>(TYPES.GroupsController).to(GroupsController).inTransientScope();

//services
container.bind<IFriendRequestService>(TYPES.IFriendRequestService).to(FriendRequestService).inSingletonScope();
container.bind<IFriendsService>(TYPES.IFriendRequestRepository).to(FriendsService).inSingletonScope();
container.bind<IBlockUserService>(TYPES.IBlockUserService).to(BlockUserService).inSingletonScope();
container.bind<IGroupsService>(TYPES.IGroupsService).to(GroupsService).inSingletonScope();
//repositories
container.bind<IFriendRequestRepository>(TYPES.IFriendRequestRepository).to(FriendRequestRepositorySequelize).inSingletonScope();
container.bind<IFriendsRepository>(TYPES.IFriendRequestRepository).to(FriendsRepositorySequelize).inSingletonScope();
container.bind<IBlockUserRepository>(TYPES.IBlockUserRepository).to(BlockUserRepositorySequelize).inSingletonScope();
container.bind<IGroupsRepository>(TYPES.IGroupsRepository).to(GroupsRepositorySequelize).inSingletonScope();

export default container;

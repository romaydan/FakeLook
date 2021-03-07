import { inject, injectable } from 'inversify';
import IFriendRequest from '../interfaces/models/friend-request.interface';
import IFriendRequestRepository from '../interfaces/repositories/friend-request-repository.interface';
import IFriendsRepository from '../interfaces/repositories/friends-repository.interaface';
import IFriendRequestService from '../interfaces/services/friend-request-service.interface';
import { TYPES } from '../ioc-container/types';

import IBlockUserService from '../interfaces/services/user-block-service.interface';
import IBlockedUser from '../interfaces/models/blocked-user.interface';
import IBlockUserRepository from '../interfaces/repositories/user-block-repository.interface';
@injectable()
export default class BlockUserService implements IBlockUserService {
  constructor(
    @inject(TYPES.IBlockUserRepository)
    private blockRepo: IBlockUserRepository
  ) {}
  blockUser(userId: string, blockId: string): Promise<IBlockedUser> {
    return this.blockRepo.addBlockedUser(userId, blockId);
  }
  async unblockUser(userId: string, blockId: string): Promise<boolean> {
    return (await this.blockRepo.removeBlockedUser(userId, blockId)) == 2;
  }
  getUsersBlockedUsers(userId: string): Promise<IBlockedUser[]> {
    return this.blockRepo.getUsersBlockedUsers(userId);
  }
}

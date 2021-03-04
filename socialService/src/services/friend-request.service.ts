import { inject, injectable } from 'inversify';
import * as uuid from 'uuid';
import { TYPES } from '../ioc-container/types';

import IFriendRequestRepository from '../interfaces/repositories/friend-request-repository.interface';
import IFriendsRepository from '../interfaces/repositories/friends-repository.interaface';
import IFriendRequestService from '../interfaces/services/friend-request-service.interface';
import IFriendRequest from '../interfaces/models/friend-request.interface';
@injectable()
export default class FriendRequestService implements IFriendRequestService {
  constructor(
    @inject(TYPES.IFriendRequestRepository)
    private friendReqRepo: IFriendRequestRepository,
    @inject(TYPES.IFriendsRepository)
    private friendsRepo: IFriendsRepository
  ) {}

  getUsersFriendRequests(userId: string): Promise<IFriendRequest[]> {
    if (uuid.validate(userId)) {
      return this.friendReqRepo.getUsersFriendRequests(userId);
    }
    throw Error('not a valid uuid');
  }

  newFriendRequest(fromId: string, toId: string): Promise<IFriendRequest> {
    return this.friendReqRepo.addFriendRequest(fromId, toId);
  }

  async acceptFriendRequest(userId: string, senderId: string) {
    await this.friendReqRepo.removeFriendRequests(senderId, userId);
    return this.friendsRepo.addFriend(userId, senderId);
  }

  async declineFriendRequest(fromId: string, toId: string) {
    const result = await this.friendReqRepo.removeFriendRequests(fromId, toId);
    return result === 2;
  }
}

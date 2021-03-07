import { inject, injectable } from 'inversify';
import IFriendRequest from '../interfaces/models/friend-request.interface';
import IFriendRequestRepository from '../interfaces/repositories/friend-request-repository.interface';
import IFriendsRepository from '../interfaces/repositories/friends-repository.interaface';
import IFriendRequestService from '../interfaces/services/friend-request-service.interface';
import { TYPES } from '../ioc-container/types';
import friendRequestModel from '../models/friend-request.model';
import * as uuid from 'uuid';

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

  async acceptFriendRequest(fromId: string, toId: string) {
    try {
      Promise.all([await this.friendReqRepo.removeFriendRequests(fromId, toId), await this.friendsRepo.addFriend(fromId, toId)]);
    } catch (error) {
      console.log('error');
    }
  }

  async declineFriendRequest(fromId: string, toId: string) {
    const result = await this.friendReqRepo.removeFriendRequests(fromId, toId);
    return result === 2;
  }
}

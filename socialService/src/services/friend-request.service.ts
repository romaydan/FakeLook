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
  getUsersFriendRequestSent(userId: string): Promise<IFriendRequest[]> {
    return this.friendReqRepo.getUsersSent(userId);
  }

  getUsersFriendRequests(userId: string): Promise<IFriendRequest[]> {
    return this.friendReqRepo.getUsersFriendRequests(userId);
  }

  newFriendRequest(fromId: string, toId: string): Promise<IFriendRequest> {
    return this.friendReqRepo.addFriendRequest(fromId, toId);
  }

  async acceptFriendRequest(userId: string, senderId: string) {
    await this.friendReqRepo.removeFriendRequests(senderId, userId);
    return this.friendsRepo.addFriend(userId, senderId);
  }

  async declineFriendRequest(userId: string, senderId: string) {
    const result = await this.friendReqRepo.removeFriendRequests(userId, senderId);
    return result === 1;
  }
}
//if (uuid.validate(userId)) {
//  }
//  throw Error('not a valid uuid');

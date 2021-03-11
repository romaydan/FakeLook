import { injectable } from 'inversify';
import IFriendRequest from '../interfaces/models/friend-request.interface';
import FriendRequest from '../models/friend-request.model';
import * as uuid from 'uuid';
import IFriendRequestRepository from '../interfaces/repositories/friend-request-repository.interface';

@injectable()
export default class FriendRequestRepositorySequelize implements IFriendRequestRepository {
  async validateFriendRequestNotExists(senderId: string, recipientId: string): Promise<boolean> {
    const result = await FriendRequest.findAll({ where: { senderId, recipientId } });
    return !(result.length > 0);
  }
  async addFriendRequest(senderId: string, recieverId: string): Promise<IFriendRequest> {
    return FriendRequest.create({
      id: uuid.v4(),
      senderId: senderId,
      recipientId: recieverId,
    });
  }

  removeFriendRequests(recipientId: string, senderId: string): Promise<number> {
    return FriendRequest.destroy({ where: { senderId, recipientId } });
  }

  getUsersFriendRequests(userId: string): Promise<IFriendRequest[]> {
    return FriendRequest.findAll({
      where: { recipientId: userId },
    });
  }
}

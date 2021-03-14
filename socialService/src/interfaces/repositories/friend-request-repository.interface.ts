import IFriendRequest from '../models/friend-request.interface';

export default interface IFriendRequestRepository {
  getUsersFriendRequests(userId: string): Promise<IFriendRequest[]>;
  getUsersSent(userId: string): Promise<IFriendRequest[]>;
  addFriendRequest(senderId: string, recipientId: string): Promise<IFriendRequest>;
  removeFriendRequests(senderId: string, recipientId: string): Promise<number>;
  validateFriendRequestNotExists(senderId: string, recipientId: string): Promise<boolean>;
}

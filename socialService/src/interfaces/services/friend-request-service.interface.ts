import FriendRequest from '../../models/friend-request.model';
import IFriendRequest from '../models/friend-request.interface';

export default interface IFriendRequestService {
  newFriendRequest(fromId: string, toId: string): Promise<IFriendRequest>;
  acceptFriendRequest(userId: string, senderId: string);
  declineFriendRequest(userId: string, senderId: string);
  getUsersFriendRequests(userId: string): Promise<IFriendRequest[]>;
}

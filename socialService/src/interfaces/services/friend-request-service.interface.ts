import FriendRequest from '../../models/friend-request.model';
import IFriendRequest from '../models/friend-request.interface';

export default interface IFriendRequestService {
  newFriendRequest(fromId: string, toId: string): Promise<IFriendRequest>;
  acceptFriendRequest(fromId: string, toId: string);
  declineFriendRequest(fromId: string, toId: string);
  getUsersFriendRequests(userId: string): Promise<IFriendRequest[]>;
}

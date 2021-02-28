import FriendRequest from '../../models/friend-request.model';
import IBlockedUser from '../models/blocked-user.interface';
import IFriendRequest from '../models/friend-request.interface';

export default interface IBlockUserService {
  blockUser(userId: string, blockId: string): Promise<IBlockedUser>;
  unblockUser(userId: string, blockId: string): Promise<boolean>;
  getUsersBlockedUsers(userId: string): Promise<IBlockedUser[]>;
}

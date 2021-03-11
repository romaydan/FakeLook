import IFriend from '../models/friend.interface';

export default interface IFriendsService {
  getUsersFriends(userId: string): Promise<IFriend[]>;
  removeFriend(userId: string, friendId: string): Promise<boolean>;
}

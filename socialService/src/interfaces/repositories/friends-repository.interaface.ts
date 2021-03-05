import IFriend from '../models/friend.interface';

export default interface IFriendsRepository {
  addFriend(fromId, toId): Promise<any>;
  deleteFriend(user1Id: string, user2Id: string): Promise<number>;
  getUsersFriends(userId: string): Promise<IFriend[]>;
}

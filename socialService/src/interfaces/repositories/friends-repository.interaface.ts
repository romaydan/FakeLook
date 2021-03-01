import IFriend from '../models/friend.interface';

export default interface IFriendsRepository {
  deleteFriend(user1Id: string, user2Id: string): Promise<number>;
  getUsersFriends(userId: string): Promise<IFriend[]>;
  addFriend(user1Id: string, user2Id: string): Promise<IFriend[]>;
}

import IFriend from './friend.interface';
import IGroupFriends from './group-friend.interface';

export default interface IGroup {
  id?: string;
  creatorId: string;
  name: string;
  createdAt?: Date;
  friends?: IGroupFriends[];
}

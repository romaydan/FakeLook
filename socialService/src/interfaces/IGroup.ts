import IFriend from './IFriend';

export default interface IGroup {
  id?: string;
  creatorId: string;
  name: string;
  createdAt: Date;
  friends: IFriend[];
}

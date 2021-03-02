import IGroup from '../models/group.interface';

export default interface IGroupsRepository {
  addGroup(group: IGroup): Promise<IGroup>;
  removeGroup(groupId: string): Promise<number>;
  getGroup(groupId: string): Promise<IGroup>;
  getUsersGroups(userId: string): Promise<IGroup[]>;
  addFriendToGroup(groupId: string, friendId: string): Promise<boolean>;
  removeFriendFromGroup(groupId: string, friendId: string): Promise<boolean>;
  updateGroup(groupId: string, group: IGroup): Promise<IGroup>;
  checkIfNameValid(name: string): Promise<boolean>;
  checkIfUserIsCreator(groupId: string, userId: string): Promise<boolean>;
}

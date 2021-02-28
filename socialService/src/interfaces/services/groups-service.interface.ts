import IGroup from '../models/group.interface';

export default interface IGroupsService {
  addNewGroup(creatorId: string, name: string): Promise<IGroup>;
  removeGroup(groupId: string): Promise<boolean>;
  getGroup(groupId: string): Promise<IGroup>;
  getUsersGroups(userId: string): Promise<IGroup[]>;
  addUserToGroup(groupId: string, userId: string): Promise<boolean>;
  removeUserFromGroup(groupId: string, userId: string): Promise<boolean>;
  updateGroupName(groupId: string, name: string, creatorId: string): Promise<IGroup>;
}

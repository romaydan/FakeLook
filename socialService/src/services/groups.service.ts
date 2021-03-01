import { inject, injectable } from 'inversify';
import { TYPES } from './../ioc-container/types';

import IGroupsService from '../interfaces/services/groups-service.interface';
import IGroupsRepository from '../interfaces/repositories/group-repository.interafce';
import IGroup from '../interfaces/models/group.interface';
@injectable()
export default class GroupsService implements IGroupsService {
  constructor(@inject(TYPES.IGroupsRepository) private groupsRepo: IGroupsRepository) {}

  async addNewGroup(creatorId: string, name: string): Promise<IGroup> {
    console.log(name);
    if (await this.groupsRepo.checkIfNameValid(name)) {
      const newGroup = await this.groupsRepo.addGroup({ creatorId: creatorId, name: name });
      newGroup.id && (await this.groupsRepo.addFriendToGroup(newGroup.id, creatorId));
      return newGroup;
    } else throw new Error('name is already taken');
  }

  async removeGroup(groupId: string): Promise<boolean> {
    return (await this.groupsRepo.removeGroup(groupId)) > 0;
  }
  async getGroup(groupId: string): Promise<IGroup> {
    return this.groupsRepo.getGroup(groupId);
  }
  getUsersGroups(userId: string): Promise<IGroup[]> {
    return this.groupsRepo.getUsersGroups(userId);
  }
  addUserToGroup(groupId: string, userId: string): Promise<boolean> {
    return this.groupsRepo.addFriendToGroup(groupId, userId);
  }
  removeUserFromGroup(groupId: string, userId: string): Promise<boolean> {
    return this.groupsRepo.removeFriendFromGroup(groupId, userId);
  }
  async updateGroupName(groupId: string, name: string, creatorId: string): Promise<IGroup> {
    if (this.groupsRepo.checkIfNameValid(name)) {
      const groupFromDb = await this.groupsRepo.getGroup(groupId);
      if (groupFromDb?.creatorId === creatorId) return this.groupsRepo.updateGroup(groupId, { creatorId, name });
      else throw new Error('group Didnt Change user is not creator');
    } else throw new Error('name already taken');
  }
}

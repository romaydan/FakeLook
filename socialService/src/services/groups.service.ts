import { inject, injectable } from 'inversify';
import { TYPES } from './../ioc-container/types';

import IGroupsService from '../interfaces/services/groups-service.interface';
import IGroupsRepository from '../interfaces/repositories/group-repository.interafce';
import IGroup from '../interfaces/models/group.interface';
import { group } from 'console';
@injectable()
export default class GroupsService implements IGroupsService {
  constructor(@inject(TYPES.IGroupsRepository) private groupsRepo: IGroupsRepository) {}

  async addNewGroup(creatorId: string, name: string): Promise<IGroup> {
    if (await this.groupsRepo.checkIfNameValid(name)) {
      const newGroup = await this.groupsRepo.addGroup({ creatorId: creatorId, name: name });
      newGroup.id && (await this.groupsRepo.addFriendToGroup(newGroup.id, creatorId));
      return newGroup;
    } else throw new Error('name is already taken');
  }

  async removeGroup(groupId: string, userId: string): Promise<boolean> {
    await this.validateCreator(groupId, userId);
    return (await this.groupsRepo.removeGroup(groupId)) > 0;
  }
  async getGroup(groupId: string, userId: string): Promise<IGroup> {
    this.validateCreator(groupId, userId);
    return this.groupsRepo.getGroup(groupId);
  }
  getUsersGroups(userId: string): Promise<IGroup[]> {
    return this.groupsRepo.getUsersGroups(userId);
  }
  async addUserToGroup(groupId: string, userId: string, friendId: string): Promise<boolean> {
    await this.validateCreator(groupId, userId);
    return this.groupsRepo.addFriendToGroup(groupId, friendId);
  }
  async removeUserFromGroup(groupId: string, userId: string, friendId: string): Promise<boolean> {
    await this.validateCreator(groupId, userId);
    return this.groupsRepo.removeFriendFromGroup(groupId, friendId);
  }
  async updateGroupName(groupId: string, name: string, userId: string): Promise<IGroup> {
    this.validateCreator(groupId, userId);
    if (this.groupsRepo.checkIfNameValid(name)) {
      return this.groupsRepo.updateGroup(groupId, { creatorId: userId, name });
    } else throw new Error('group Didnt Change user is not creator');
  }
  private async validateCreator(groupId: string, userId: string) {
    if (!(await this.groupsRepo.checkIfUserIsCreator(groupId, userId))) throw new Error('user is not creator');
  }
}

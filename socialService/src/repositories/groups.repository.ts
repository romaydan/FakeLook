import { injectable } from 'inversify';
import * as uuid from 'uuid';
import { Op } from 'sequelize';

import IGroup from '../interfaces/models/group.interface';
import IGroupsRepository from '../interfaces/repositories/group-repository.interafce';
import GroupFriends from '../models/group-friends.model';
import Group from '../models/group.model';

@injectable()
export default class GroupsRepositorySequelize implements IGroupsRepository {
  async checkIfNameValid(name: string): Promise<boolean> {
    const res = await Group.findAll({ where: { name } });
    return res.length === 0;
  }
  addGroup(group: IGroup): Promise<IGroup> {
    return Group.create({ id: uuid.v4(), ...group });
  }

  removeGroup(groupId: string): Promise<number> {
    return Group.destroy({ where: { id: groupId } });
  }

  getGroup(groupId: string): Promise<IGroup> {
    if (!groupId) {
      throw new ReferenceError('No group id given!');
    }

    return Group.findOne({ where: { id: groupId } });
  }

  async getUsersGroups(userId: string): Promise<IGroup[]> {
    const groupFriends = await GroupFriends.findAll({ where: { friendId: userId } });
    if (groupFriends.length === 0) {
      throw new Error('the user has no groups');
    } else {
      const groupFriendsIds = groupFriends.map((gf) => gf.groupId);
      return Group.findAll({ where: { id: { [Op.in]: groupFriendsIds } } });
    }
  }

  async addFriendToGroup(groupId: string, friendId: string): Promise<boolean> {
    return (await GroupFriends.create({ groupId, friendId })) !== null;
  }

  async removeFriendFromGroup(groupId: string, friendId: string): Promise<boolean> {
    return (await GroupFriends.destroy({ where: { groupId, friendId } })) > 0;
  }
  async updateGroup(groupId: string, group: IGroup): Promise<IGroup> {
    const [rowsCount] = await Group.update(group, { where: { id: groupId } });
    if (rowsCount > 0) return Group.findOne({ where: { id: groupId } });
    else throw new Error('group Not Found');
  }
}

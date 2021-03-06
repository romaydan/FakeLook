import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { TYPES } from '../ioc-container/types';
import IGroupsService from '../interfaces/services/groups-service.interface';

@injectable()
export default class GroupsController {
  constructor(@inject(TYPES.IGroupsService) private groupsServ: IGroupsService) {
    this.addGroup = this.addGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.getGroup = this.getGroup.bind(this);
    this.getUsersGroup = this.getUsersGroup.bind(this);
    this.changeGroupName = this.changeGroupName.bind(this);
    this.addFriendToGroup = this.addFriendToGroup.bind(this);
    this.remvoeFriendFromGroup = this.remvoeFriendFromGroup.bind(this);
  }

  async addGroup(req: Request, res: Response) {
    const { userId, name } = req.body.data;
    console.log('req.body.data', req.body.data);
    try {
      const result = await this.groupsServ.addNewGroup(userId, name);
      res.send(result);
    } catch (error) {
      console.log('error', error);
      res.status(500).send({ message: error.message });
    }
  }

  async deleteGroup(req: Request, res: Response) {
    try {
      const { userId, groupId } = req.params;
      console.log('userId', userId);
      console.log('groupId', groupId);
      const result = await this.groupsServ.removeGroup(groupId, userId);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getGroup(req: Request, res: Response) {
    try {
      const { groupId, userId } = req.params;
      console.log('groupId', groupId);
      const result = await this.groupsServ.getGroup(req.params.groupId, userId);
      res.send(result);
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  }

  async getUsersGroup(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await this.groupsServ.getUsersGroups(userId);
      res.status(200).send(result);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }

  async changeGroupName(req: Request, res: Response) {
    try {
      const { groupId, name, userId } = req.body.data;
      const result = await this.groupsServ.updateGroupName(groupId, name, userId);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async addFriendToGroup(req: Request, res: Response) {
    try {
      const { groupId, userId, friendId } = req.body.data;
      const result = await this.groupsServ.addUserToGroup(groupId, userId, friendId);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async remvoeFriendFromGroup(req: Request, res: Response) {
    try {
      const { groupId, userId, friendId } = req.body.data;
      console.log('req.body.data', req.body.data);
      const result = await this.groupsServ.removeUserFromGroup(groupId, userId, friendId);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

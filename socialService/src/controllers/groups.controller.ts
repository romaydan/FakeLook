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

  // initRoutes() {
  //   this.router.get('/:groupId', this.getGroup);
  //   this.router.get('/user/:id', this.getUsersGroup);
  //   this.router.post('/', this.addGroup);
  //   this.router.delete('/:groupId', this.deleteGroup);
  //   this.router.put('/name', this.changeGroupName);
  //   this.router.put('/addFriend', this.addFriendToGroup);
  //   this.router.put('/removeFriend', this.remvoeFriendFromGroup);
  // }

  async addGroup(req: Request, res: Response) {
    const { userId, name } = req.body;
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
      const result = await this.groupsServ.removeGroup(req.params.groupId);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getGroup(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      console.log('groupId', groupId);
      const result = await this.groupsServ.getGroup(req.params.groupId);
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
      const { groupId, name, userId } = req.body;
      const result = await this.groupsServ.updateGroupName(groupId, name, userId);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async addFriendToGroup(req: Request, res: Response) {
    try {
      const { groupId, userId } = req.body;
      const result = await this.groupsServ.addUserToGroup(groupId, userId);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async remvoeFriendFromGroup(req: Request, res: Response) {
    try {
      const { groupId, userId } = req.body;
      const result = await this.groupsServ.removeUserFromGroup(groupId, userId);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

import * as express from 'express';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import IFriendRequestService from '../interfaces/services/friend-request-service.interface';
import IFriendsService from '../interfaces/services/friend-service.interface';
import IBlockUserService from '../interfaces/services/user-block-service.interface';
import { TYPES } from '../ioc-container/types';

@injectable()
export default class FriendsController {
  public path = '/api/friendRequest';
  public router = express.Router();
  constructor(
    @inject(TYPES.IFriendRequestService)
    private friendReqSrv: IFriendRequestService,
    @inject(TYPES.IFriendsService)
    private friendsSrv: IFriendsService,
    @inject(TYPES.IBlockUserService)
    private blockSrv: IBlockUserService
  ) {
    this.newFriendRequest = this.newFriendRequest.bind(this);
    this.declinefriendRequest = this.declinefriendRequest.bind(this);
    this.acceptfriendRequest = this.acceptfriendRequest.bind(this);
    this.getUsersFriends = this.getUsersFriends.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
  }

  newFriendRequest = async (req: Request, res: Response) => {
    try {
      const { userId, recepientId } = req.body;
      const result = await this.friendReqSrv.newFriendRequest(userId, recepientId);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  declinefriendRequest = async (req: Request, res: Response) => {
    try {
      const { userId, recepientId } = req.body;
      const result = await this.friendReqSrv.declineFriendRequest(userId, recepientId);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  acceptfriendRequest = async (req: Request, res: Response) => {
    try {
      const { userId, recepientId } = req.body;
      const result = await this.friendReqSrv.acceptFriendRequest(userId, recepientId);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  getUsersFriends = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const result = await this.friendsSrv.getUsersFriends(userId);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  removeFriend = async (req: Request, res: Response) => {
    try {
      const { userId, recepientId } = req.body;
      const result = await this.friendsSrv.removeFriend(userId, recepientId);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  blockUser = async (req: Request, res: Response) => {
    try {
      const { userId, blockedId } = req.body;
      const result = await this.blockSrv.blockUser(userId, blockedId);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  unblockUser = async (req: Request, res: Response) => {
    try {
      const { userId, blockedId } = req.body;
      const result = await this.blockSrv.unblockUser(userId, blockedId);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  usersBlocks = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.blockSrv.getUsersBlockedUsers(id);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}

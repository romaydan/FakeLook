import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../ioc-container/types';
import IFriendRequestService from '../interfaces/services/friend-request-service.interface';
import IFriendsService from '../interfaces/services/friend-service.interface';
import IBlockUserService from '../interfaces/services/user-block-service.interface';

@injectable()
export default class FriendsController {
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
    this.blockUser = this.blockUser.bind(this);
    this.unblockUser = this.unblockUser.bind(this);
    this.usersBlocks = this.usersBlocks.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.getUsersFriendRequests = this.getUsersFriendRequests.bind(this);
  }

  getUsersFriends = async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const result = await this.friendsSrv.getUsersFriends(userId as string);
      const ids = result.map((fr) => fr.friendId);
      res.send(ids);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  removeFriend = async (req: Request, res: Response) => {
    try {
      const { userId, friendId } = req.query;
      const result = await this.friendsSrv.removeFriend(userId as string, friendId as string);
      res.send(result);
    } catch (error) {
      console.log('error', error);
      res.status(500).send(error.message);
    }
  };

  getUsersFriendRequests = async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const result = await this.friendReqSrv.getUsersFriendRequests(userId as string);
      res.send(result.map((fr) => fr.senderId));
    } catch (error) {
      console.log('error', error);
      res.status(500).send(error.message);
    }
  };

  newFriendRequest = async (req: Request, res: Response) => {
    try {
      const { userId, recepientId } = req.body.data;

      const result = await this.friendReqSrv.newFriendRequest(userId as string, recepientId as string);
      res.send(result);
    } catch (error) {
      console.log('error', error);
      res.status(500).send(error.message);
    }
  };

  acceptfriendRequest = async (req: Request, res: Response) => {
    try {
      const { userId, senderId } = req.body.data;
      const result = await this.friendReqSrv.acceptFriendRequest(userId as string, senderId as string);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  declinefriendRequest = async (req: Request, res: Response) => {
    try {
      const { userId, senderId } = req.body.data;
      const result = await this.friendReqSrv.declineFriendRequest(userId as string, senderId as string);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  usersBlocks = async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const result = await this.blockSrv.getUsersBlockedUsers(userId as string);
      res.send(result.map((ub) => ub.blockedId));
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  usersBlockers = async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const result = await this.blockSrv.getUsersBlockers(userId as string);
      res.send(result.map((ub) => ub.blockerId));
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  blockUser = async (req: Request, res: Response) => {
    try {
      const { userId, friendId } = req.body.data;
      const result = await this.blockSrv.blockUser(userId as string, friendId as string);
      res.send(result);
    } catch (error) {
      console.log('error.message', error.message);
      res.status(500).send(error.message);
    }
  };

  unblockUser = async (req: Request, res: Response) => {
    try {
      const { userId, friendId } = req.body.data;
      const result = await this.blockSrv.unblockUser(userId as string, friendId as string);
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}

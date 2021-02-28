import { TYPES } from '../ioc-container/types';
import { inject, injectable } from 'inversify';
import IFriendsService from '../interfaces/services/friend-service.interface';
import IFriendsRepository from '../interfaces/repositories/friends-repository.interaface';
import IFriend from '../interfaces/models/friend.interface';

@injectable()
export default class FriendsService implements IFriendsService {
  constructor(@inject(TYPES.IFriendsRepository) private friendsRepo: IFriendsRepository) {}
  async removeFriend(userId: string, friendId: any): Promise<boolean> {
    return (await this.friendsRepo.deleteFriend(userId, friendId)) == 2;
  }
  getUsersFriends(userId: string): Promise<IFriend[]> {
    return this.friendsRepo.getUsersFriends(userId);
  }
}

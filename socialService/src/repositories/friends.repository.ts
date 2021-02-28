import { injectable } from 'inversify';
import { Op } from 'sequelize';
import * as uuid from 'uuid';

import IFriend from '../interfaces/models/friend.interface';
import IFriendsRepository from '../interfaces/repositories/friends-repository.interaface';
import Friend from '../models/friend.model';

@injectable()
export default class FriendsRepositorySequelize implements IFriendsRepository {
  getUsersFriends(userId: string): Promise<IFriend[]> {
    return Friend.findAll({ where: { userId: userId } });
  }

  addFriend(user1Id: string, user2Id: string): Promise<IFriend[]> {
    return Friend.bulkCreate([
      { id: uuid.v4(), userId: user1Id, friendId: user2Id },
      { id: uuid.v4(), userId: user2Id, friendId: user1Id },
    ]);
  }
  deleteFriend(user1Id: string, user2Id: string): Promise<number> {
    return Friend.destroy({
      where: {
        [Op.or]: [
          { userId: user1Id, friendId: user2Id },
          { userId: user2Id, friendId: user1Id },
        ],
      },
    });
  }
}

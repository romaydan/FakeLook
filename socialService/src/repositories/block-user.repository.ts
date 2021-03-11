import { injectable } from 'inversify';
import IBlockedUser from '../interfaces/models/blocked-user.interface';
import IBlockUserRepository from '../interfaces/repositories/user-block-repository.interface';
import BlockedUser from '../models/block-user.model';

@injectable()
export default class BlockUserRepositorySequelize implements IBlockUserRepository {
  async userBlockExists(blockerId: string, blockedId: string): Promise<boolean> {
    return (await (await BlockedUser.findAll({ where: { blockerId, blockedId } })).length) > 0;
  }
  getUsersBlockers(userId: string): Promise<IBlockedUser[]> {
    return BlockedUser.findAll({ where: { blockedId: userId } });
  }
  async BlockUsersExists(blockerId: string, blockedId: string): Promise<boolean> {
    const blockedUsersFromDb = await BlockedUser.findAll({ where: { blockerId, blockedId } });
    return blockedUsersFromDb.length > 1;
  }
  getUsersBlockedUsers(userId: string): Promise<IBlockedUser[]> {
    return BlockedUser.findAll({ where: { blockerId: userId } });
  }
  addBlockedUser(blockerId: string, blockedId: string): Promise<IBlockedUser> {
    return BlockedUser.create({ blockerId, blockedId });
  }
  removeBlockedUser(blockerId: string, blockedId: string): Promise<number> {
    return BlockedUser.destroy({ where: { blockerId, blockedId } });
  }
}

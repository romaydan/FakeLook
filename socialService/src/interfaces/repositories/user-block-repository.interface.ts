import IBlockedUser from '../models/blocked-user.interface';

export default interface IBlockUserRepository {
  addBlockedUser(blockerId: string, blockedId: string): Promise<IBlockedUser>;
  removeBlockedUser(blockerId: string, blockedId: string): Promise<number>;
  getUsersBlockedUsers(userId: string): Promise<IBlockedUser[]>;
  BlockUsersExists(blockerId: string, blockedId: string): Promise<boolean>;
  getUsersBlockers(userId: string): Promise<IBlockedUser[]>;
  userBlockExists(blockerId: string, blockedId: string): Promise<boolean>;
}

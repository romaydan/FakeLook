import { Sequelize } from 'sequelize-typescript';
import BlockedUser from '../models/friend-block.model';
import FriendRequest from '../models/friend-request.model';
import Friend from '../models/friend.model';
import GroupFriends from '../models/group-friends.model';
import Group from '../models/group.model';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: `${__dirname}\\data\\socialDb.db`,
});

db.addModels([Friend, Group, GroupFriends, BlockedUser, FriendRequest]);

export default db;

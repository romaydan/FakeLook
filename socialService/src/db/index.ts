import { Sequelize } from 'sequelize-typescript';
import BlockedUser from '../models/block-user.model';
import FriendRequest from '../models/friend-request.model';
import Friend from '../models/friend.model';
import GroupFriends from '../models/group-friends.model';
import Group from '../models/group.model';

const db = new Sequelize('social', 'postgres', process.env.POSTGRES_PASSWORD, {
  dialect: 'postgres',
  host: process.env.POSTGRES_IP,
  port: Number(process.env.POSTGRES_PORT),
  logging: (sql, timing) => {},
});

db.addModels([Friend, Group, GroupFriends, BlockedUser, FriendRequest]);

export default db;

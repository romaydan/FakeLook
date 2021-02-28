import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType, Unique, BelongsToMany, HasMany } from 'sequelize-typescript';
import IFriend from '../interfaces/models/friend.interface';
import IGroupFriends from '../interfaces/models/group-friend.interface';
import groupFriendInterface from '../interfaces/models/group-friend.interface';
import IGroup from '../interfaces/models/group.interface';
import Friend from './friend.model';
import GroupFriends from './group-friends.model';
@Table({
  tableName: 'groups',
})
export default class Group extends Model implements IGroup {
  @PrimaryKey
  @Column(DataType.UUIDV4)
  public id: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.UUIDV4)
  creatorId: string;

  @AllowNull(false)
  @Unique
  @NotEmpty
  @Column(DataType.UUIDV4)
  name: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.DATE)
  createdAt: Date;

  @HasMany(() => GroupFriends)
  friends: IGroupFriends[];
}

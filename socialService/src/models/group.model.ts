import {
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  NotEmpty,
  Model,
  DataType,
  Unique,
  BelongsToMany,
} from 'sequelize-typescript';
import IFriend from '../interfaces/IFriend';
import IGroup from '../interfaces/IGroup';
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

  @BelongsToMany(() => Friend, () => GroupFriends)
  friends: IFriend[];
}

import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import IFriend from '../interfaces/models/friend.interface';
import IGroup from '../interfaces/models/group.interface';
import GroupFriends from './group-friends.model';
import Group from './group.model';

@Table({
  tableName: 'friends',
})
export default class Friend extends Model implements IFriend {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @NotEmpty
  @AllowNull(false)
  @Column(DataType.STRING)
  public userId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public friendId: string;
}

import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType, Unique, BelongsToMany, ForeignKey } from 'sequelize-typescript';
import IGroupFriends from '../interfaces/models/group-friend.interface';
import Friend from './friend.model';
import Group from './group.model';
@Table({
  tableName: 'group-friends',
})
export default class GroupFriends extends Model implements IGroupFriends {
  @ForeignKey(() => Group)
  @Column(DataType.STRING)
  public groupId: string;

  @Column(DataType.STRING)
  public friendId: string;
}

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
  ForeignKey,
} from 'sequelize-typescript';
import Friend from './friend.model';
import Group from './group.model';
@Table({
  tableName: 'group-friends',
})
export default class GroupFriends extends Model {
  @ForeignKey(() => Group)
  @Column(DataType.UUIDV4)
  public groupId: string;

  @ForeignKey(() => Friend)
  @Column(DataType.UUIDV4)
  public friendId: string;
}

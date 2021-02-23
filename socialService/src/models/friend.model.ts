import {
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  NotEmpty,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import IFriend from '../interfaces/IFriend';
import IGroup from '../interfaces/IGroup';
import GroupFriends from './group-friends.model';
import Group from './group.model';

@Table({
  tableName: 'friends',
})
export default class Friend extends Model implements IFriend {
  @PrimaryKey
  @Column(DataType.UUIDV4)
  public id: string;

  @NotEmpty
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  public userId: string;

  @AllowNull(false)
  @Column(DataType.UUIDV4)
  public friendId: string;

  @BelongsToMany(() => Group, () => GroupFriends)
  groups: IGroup[];
}

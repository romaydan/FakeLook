import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType } from 'sequelize-typescript';
import IFriendRequest from '../interfaces/models/friend-request.interface';
@Table({
  tableName: 'friendRequest',
})
export default class FriendRequest extends Model implements IFriendRequest {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public senderId: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public recipientId: string;
}

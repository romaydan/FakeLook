import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType } from 'sequelize-typescript';
import IFriendRequest from '../interfaces/models/friend-request.interface';
@Table({
  tableName: 'friendRequest',
})
export default class FriendRequest extends Model implements IFriendRequest {
  @PrimaryKey
  @Column(DataType.UUIDV4)
  public id: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.UUIDV4)
  public senderId: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.UUIDV4)
  public recipientId: string;
}

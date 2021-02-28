import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType } from 'sequelize-typescript';
import IBlockedUser from '../interfaces/models/blocked-user.interface';
@Table({
  tableName: 'blockedUsers',
})
export default class BlockedUser extends Model implements IBlockedUser {
  @PrimaryKey
  @Column(DataType.UUIDV4)
  public id: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.UUIDV4)
  blockedId: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.UUIDV4)
  blockerId: string;
}

import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType } from 'sequelize-typescript';
import IBlockedUser from '../interfaces/models/blocked-user.interface';
@Table({
  tableName: 'blockedUsers',
})
export default class BlockedUser extends Model implements IBlockedUser {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  blockedId: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  blockerId: string;
}

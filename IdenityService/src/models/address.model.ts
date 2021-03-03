import {
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  NotEmpty,
  Model,
  DataType,
  Unique,
  BelongsTo,
  NotNull,
  ForeignKey,
} from 'sequelize-typescript';
import IAddress from '../interfaces/IAddress';
import User from './user.model';
@Table({
  tableName: 'addresses',
})
export default class Address extends Model implements IAddress {
  @PrimaryKey
  @Column(DataType.UUIDV4)
  public id: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public city: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public country: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public street: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public houseNo: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  public aptNo: string;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  public userId;

  @BelongsTo(() => User)
  public user: User;
}

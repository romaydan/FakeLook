import { Address, IAddress } from './address.model';
import {
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  NotEmpty,
  Model,
  DataType,
  Unique,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class User extends Model implements IUser {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column(DataType.STRING)
  public identifier: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public name: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.DATE)
  public birthDate: Date;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public authId: string;

  @HasOne(() => Address)
  @ForeignKey(() => Address)
  public address: IAddress;
}

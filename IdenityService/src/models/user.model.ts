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
import IAddress from '../interfaces/IAddress';
import Address from './address.model';

import IUser from '../interfaces/IUser';

@Table({
  tableName: 'users',
})
export default class User extends Model implements IUser {
  @PrimaryKey
  @Column(DataType.UUID)
  public id: string;

  // @AllowNull(false)
  // @NotEmpty
  // @Unique
  // @Column(DataType.STRING)
  // public identifier: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public firstName: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public lastName: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.DATE)
  public birthDate: Date;

  @AllowNull(true)
  @NotEmpty
  @Column(DataType.STRING)
  public authId: string;

  @HasOne(() => Address)
  public address: Address;
}

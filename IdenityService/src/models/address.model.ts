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
} from 'sequelize-typescript';
import { IAddress } from '../interfaces/IAddress';

@Table({
  tableName: 'users',
})
export class Address extends Model implements IAddress {
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
  public aptNo: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public houseNo: string;
}

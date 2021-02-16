import { DATE } from 'sequelize';
import { Table, Column, PrimaryKey, NotNull, AllowNull, NotEmpty, Model, IsUUID, DataType, Unique, AutoIncrement } from 'sequelize-typescript';

export interface IUser {
    id?: string,
    email: string,
    password: string
}

@Table({
    tableName: 'users'
})
export class User extends Model implements IUser {
    @PrimaryKey
    @Column(DataType.STRING)
    public id: string;
    @AllowNull(false)
    @NotEmpty
    @Unique
    @Column(DataType.STRING)
    public email: string;
    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    public password: string;
}
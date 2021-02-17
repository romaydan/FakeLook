import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType, Unique } from 'sequelize-typescript';

export interface IUser {
    id?: string,
    credential: string,
    password: string,
    isOAuthUser: boolean
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
    public credential: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    public password: string;
    
    @AllowNull(false)
    @NotEmpty
    @Column(DataType.BOOLEAN)
    public isOAuthUser: boolean;
}
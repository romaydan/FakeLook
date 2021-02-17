
import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType, Unique } from 'sequelize-typescript';

export interface IFacebookUser {
    id?: string,
    user_id: string,
}

@Table({
    tableName: 'fb-users'
})
export class FacebookUser extends Model implements IFacebookUser {
    @PrimaryKey
    @Column(DataType.STRING)
    public id: string;

    @AllowNull(false)
    @NotEmpty
    @Unique
    @Column(DataType.STRING)
    public user_id: string;
}
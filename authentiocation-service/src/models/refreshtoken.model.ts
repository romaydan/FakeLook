import { Table, Model, PrimaryKey, Column, DataType, AllowNull, NotEmpty, AutoIncrement, Is } from "sequelize-typescript";

export interface IRefreshToken {
    id?: number;
    token: string;
}

@Table({
    tableName: 'token-blacklist'
})
export default class RefreshToken extends Model implements IRefreshToken {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    public id: number;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    public token: string;
}
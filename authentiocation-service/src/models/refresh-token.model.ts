import { Table, Model, PrimaryKey, Column, DataType, AllowNull, NotEmpty, AutoIncrement } from "sequelize-typescript";

@Table({
    tableName: 'token-blacklist'
})
export default class RefreshToken extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    public id: number;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    public token: string
}
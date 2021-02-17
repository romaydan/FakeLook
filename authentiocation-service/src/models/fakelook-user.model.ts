import { Table, Column, PrimaryKey, AllowNull, NotEmpty, Model, DataType, Unique } from 'sequelize-typescript';

export interface IFakeLookUser {
    id?: string,
    email: string,
    password: string,
    isEditable: boolean
}

@Table({
    tableName: 'fl-users'
})
export class FakLookUser extends Model implements IFakeLookUser {
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
    
    @AllowNull(false)
    @NotEmpty
    @Column(DataType.BOOLEAN)
    public isEditable: boolean;
}
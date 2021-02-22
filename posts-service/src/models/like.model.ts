import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Post } from "./post.model";

export interface ILike {
    id?: string;
    postId: string;
    userId: string;
}

@Table
export class Like extends Model implements ILike {
    @PrimaryKey
    @Column(DataType.STRING)
    id?: string;

    @AllowNull(false)
    @ForeignKey(() => Post)
    @Column(DataType.STRING)
    postId: string;
    
    @AllowNull(false)
    @Column(DataType.STRING)
    userId: string;

    @BelongsTo(() => Post)
    post?: Post;
}
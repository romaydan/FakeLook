import { AllowNull, Column, DataType, PrimaryKey, Table, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Post } from "./post.model";

export interface IComment {
    id?: string;
    content: string;
    userId: string;
    postId: string;
    name: string;
}

@Table
export class Comment extends Model implements IComment {

    @PrimaryKey
    @Column(DataType.STRING)
    id?: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    content: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    userId: string;

    @AllowNull
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @ForeignKey(() => Post)
    @Column(DataType.STRING)
    postId: string;

    @BelongsTo(() => Post)
    post: Post;
}
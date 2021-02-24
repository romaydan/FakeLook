import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Post } from "./post.model";

export interface IUserTag {
    id?: string;
    userId: string;
    postId: string;
}

@Table
export class UserTag extends Model implements IUserTag {
    @PrimaryKey
    @Column(DataType.STRING)
    id?: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    userId: string;
    
    @AllowNull(false)
    @ForeignKey(() => Post)
    @Column(DataType.STRING)
    postId: string;

    @BelongsTo(() => Post)
    post: Post;
}

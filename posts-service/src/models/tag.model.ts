import { AllowNull, BelongsToMany, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Post } from "./post.model";

export interface ITag {
    id?: string;
    content: string;
}

@Table
export class Tag extends Model implements ITag {
    @PrimaryKey
    @Column(DataType.STRING)
    id?: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    content: string;

    @BelongsToMany(() => Post, () => PostTag)
    posts: Post[];
}

@Table
export class PostTag extends Model {
    @ForeignKey(() => Post)
    @PrimaryKey
    @Column
    postId: string;

    @ForeignKey(() => Tag)
    @PrimaryKey
    @Column
    tagId: string;
}
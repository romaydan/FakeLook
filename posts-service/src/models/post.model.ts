import { AllowNull, Column, DataType, PrimaryKey, Table, Model, HasMany, BelongsToMany } from "sequelize-typescript";
import { IComment, Comment } from "./comment.model";
import { ILike, Like } from "./like.model";
import { ITag, PostTag, Tag } from "./tag.model";
import { IUserTag, UserTag } from "./user-tag.model";

export enum ShowOptions {
    All,
    Followers
}

export interface IPost {
    id?: string;
    userId: string;
    imageUrl: string;
    location: string;
    textContent: string;
    showTo: ShowOptions;
    likes: Like[];
    comments: Comment[];
    userTags: UserTag[];
    tags: Tag[];
}

@Table
export class Post extends Model implements IPost {
    @PrimaryKey
    @Column(DataType.STRING)
    id?: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    userId: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    imageUrl: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    location: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    textContent: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    showTo: ShowOptions;

    @HasMany(() => Like)
    likes: Like[];

    @HasMany(() => Comment)
    comments: Comment[];

    @HasMany(() => UserTag)
    userTags!: UserTag[];

    @BelongsToMany(() => Tag, () => PostTag)
    tags: Tag[];
}
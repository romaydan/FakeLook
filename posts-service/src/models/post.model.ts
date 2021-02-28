import { AllowNull, Column, DataType, PrimaryKey, Table, Model, HasMany, BelongsToMany } from "sequelize-typescript";
import { IComment, Comment } from "./comment.model";
import { ILike, Like } from "./like.model";
import { ITag, PostTag, Tag } from "./tag.model";
import { IUserTag, UserTag } from "./usertag.model";

export enum ShowOptions {
    All,
    Followers
}

export interface IPost {
    id?: string;
    publisherId: string;
    imageUrl: string;
    location: {
        type: 'Point',
        coordinates: number[]
    };
    textContent: string;
    showTo: ShowOptions;
    likes?: ILike[];
    comments?: IComment[];
    userTags?: IUserTag[];
    tags?: ITag[];
    createdAt?: Date;
}

@Table
export class Post extends Model implements IPost {
    @PrimaryKey
    @Column(DataType.STRING)
    id?: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    publisherId: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    imageUrl: string;

    @AllowNull(false)
    @Column(DataType.GEOMETRY('POINT', 4326))
    location: {
        type: 'Point',
        coordinates: number[]
    };

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

    @Column(DataType.DATE)
    createdAt: Date
}
import { injectable } from "inversify";
import { Op } from "sequelize";
import { IPost, Post } from "../models/post.model";
import uuid from 'uuid';
import { UserTag } from "../models/user-tag.model";
import { Like } from "../models/like.model";
import { Comment } from "../models/comment.model";
import { PostTag, Tag } from "../models/tag.model";

export interface IPostRepository {
    getAllPostsByUserId(userId: string): Promise<IPost[]>;
    getFilteredPost(userFilter: string[], tagFilter: string[]): Promise<IPost[]>;
    getPostById(postId: string): Promise<IPost>;
    addPost(post: IPost): Promise<IPost>;
    removePost(postId: string): Promise<boolean>;
    updatePost(post: IPost): Promise<boolean>;
}

@injectable()
export class PostRepository implements IPostRepository {
    constructor() {
        this.getAllPostsByUserId = this.getAllPostsByUserId.bind(this);
        this.getFilteredPost = this.getFilteredPost.bind(this);
        this.addPost = this.addPost.bind(this);
        this.removePost = this.removePost.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    getAllPostsByUserId(userId: string): Promise<IPost[]> {
        return Post.findAll({
            where: {
                userId: userId
            }
        });
    }

    getPostById(postId: string): Promise<IPost> {
        return Post.findOne({
            include: [
                {
                    model: Tag,
                    through: { attributes: [], where: { postId: postId } }
                },
                Comment, Like, UserTag],
            where: { id: postId }
        })
    }

    getFilteredPost(userFilter: string[], tagFilter: string[]): Promise<IPost[]> {
        return Post.findAll({
            include: {
                model: Tag,
                attributes: [],
                through: { attributes: [], where: tagFilter?.length > 0 ? { tagId: { [Op.in]: tagFilter } } : {} }
            },
            where: userFilter?.length > 0 ? { userId: { [Op.in]: userFilter } } : {}
        });
    }

    addPost(post: IPost): Promise<IPost> {
        return new Post({ id: uuid.v4(), ...post }).save();
    }

    removePost(postId: string): Promise<boolean> {
        return Post.destroy({
            where: {
                id: postId
            }
        }).then(async count => {
            if (count > 0) {
                const delPostTags = PostTag.destroy({
                    where: {
                        postId: postId
                    }
                })

                const delComments = Comment.destroy({
                    where: {
                        postId: postId
                    }
                })

                const delLikes = Like.destroy({
                    where: {
                        postId: postId
                    }
                });

                const delUsertags = UserTag.destroy({
                    where: {
                        postId: postId
                    }
                })

                await Promise.all([delPostTags, delComments, delLikes, delUsertags]);
                return true;
            }

            return false;
        });
    }

    async updatePost(post: IPost): Promise<boolean> {
        const [count] = await Post.update(post, {
            where: {
                id: post.id
            }
        })

        return count > 0;
    }
}
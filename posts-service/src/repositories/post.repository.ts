import { injectable } from "inversify";
import { Op } from "sequelize";
import { IPost, Post } from "../models/post.model";
import { UserTag } from "../models/usertag.model";
import { Like } from "../models/like.model";
import { Comment } from "../models/comment.model";
import { PostTag, Tag } from "../models/tag.model";
import sequelize from "sequelize";

export interface IPostRepository {
    getAllPostsByUserId(userId: string): Promise<IPost[]>;
    getFilteredPost(userFilter: string[], tagFilter: string[], publishers: string[], location: number[], distance: number, from: Date, to: Date): Promise<IPost[]>;
    getPostById(postId: string): Promise<IPost>;
    addPost(post: IPost): Promise<IPost>;
    removePost(postId: string): Promise<IPost>;
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
        if (!userId) {
            throw new ReferenceError('No user id given!');
        }

        return Post.findAll({
            where: {
                userId: userId
            }
        });
    }

    getPostById(postId: string): Promise<IPost> {
        if (!postId) {
            throw new ReferenceError('No post id given!');
        }

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

    getFilteredPost(userFilter: string[] = [], tagFilter: string[] = [], publishers: string[], location: number[], distance: number, from: Date, to: Date): Promise<IPost[]> {
        return Post.findAll({
            include: [
                tagFilter.length > 0 ?
                    {
                        model: Tag,
                        through: { attributes: [] },
                        where: { content: { [Op.in]: tagFilter } }
                    }
                    :
                    {
                        model: Tag,
                        through: {
                            attributes: []
                        }
                    },
                userFilter.length > 0 ?
                    {
                        model: UserTag,
                        where: { userId: { [Op.in]: userFilter } }
                    }
                    :
                    {
                        model: UserTag
                    },
                Like, Comment],
            where: {
                [Op.and]: [
                    (sequelize.fn('ST_DWithin', sequelize.col('location'), sequelize.fn('ST_SetSRID', sequelize.fn('ST_MakePoint', location[0], location[1]), 4326), distance, false)),
                    {
                        createdAt: {
                            [Op.gte]: from,
                            [Op.lte]: to
                        }
                    },
                    {
                        publisherId: publishers?.length > 0 ? { [Op.in]: publishers } : { [Op.not]: null }
                    }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: 100
        });
    }

    addPost(post: IPost): Promise<IPost> {
        if (!post) {
            throw new ReferenceError('No post provided!');
        }

        return new Post(post).save();
    }

    async removePost(postId: string): Promise<IPost> {
        if (!postId) {
            throw new ReferenceError('No post id given!');
        }

        const post = await Post.findOne({
            include: [
                {
                    model: Tag,
                    through: {
                        attributes: []
                    }
                },
                UserTag, Comment, Like],
            where: {
                id: postId
            }
        })

        const success = await Post.destroy({
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

        if (success) {
            return post;
        }

        throw new Error('Unable to delete post! Please try again later.');
    }

    async updatePost(post: IPost): Promise<boolean> {
        if (!post) {
            throw new ReferenceError('No update data provided!');
        }


        const [count] = await Post.update(post, {
            where: {
                id: post.id
            }
        })

        return count > 0;
    }
}
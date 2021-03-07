import { injectable } from "inversify";
import { Comment, IComment } from "../models/comment.model";
import * as uuid from 'uuid';
import { Op } from "sequelize";

export interface ICommentRepository {
    addCommentToPost(comment: IComment, postId: string): Promise<IComment>;
    removeCommentFromPost(commentId: string, postId: string): Promise<boolean>;
    updateComment(comment: IComment): Promise<boolean>;
    getAllCommentsByPostId(postId: string): Promise<IComment[]>;
    isCommentOfUser(commentId: string, userId: string): Promise<boolean>;
}

@injectable()
export class CommentRepository implements ICommentRepository {
    constructor() {
        this.addCommentToPost = this.addCommentToPost.bind(this);
        this.removeCommentFromPost = this.removeCommentFromPost.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.getAllCommentsByPostId = this.getAllCommentsByPostId.bind(this);
    }

    addCommentToPost(comment: IComment, postId: string): Promise<IComment> {
        return Comment.create({ id: uuid.v4(), ...comment, postId: postId });
    }

    async isCommentOfUser(commentId: string, userId: string): Promise<boolean> {
        const comment = await Comment.findOne({
            where: {
                id: commentId,
                userId: userId
            }
        })

        return comment ? true : false;
    }

    getAllCommentsByPostId(postId: string): Promise<IComment[]> {
        return Comment.findAll({
            where: {
                postId: postId
            }
        })
    }

    async removeCommentFromPost(commentId: string, postId: string): Promise<boolean> {
        const count = await Comment.destroy({
            where: {
                id: commentId,
                postId: postId
            }
        })

        return count > 0;
    }

    async updateComment(comment: IComment): Promise<boolean> {
        const [count] = await Comment.update(comment, {
            where: {
                id: comment.id
            }
        });

        return count > 0;
    }

}
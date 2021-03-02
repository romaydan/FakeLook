import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { IComment } from "../models/comment.model";
import { ICommentRepository } from "../repositories/comment.repository";

export interface ICommentService {
    addComment(comment: IComment, postId: string): Promise<IComment>;
    removeCommentById(commentId: string, postId: string, userId: string): Promise<boolean>;
    updateComment(comment: IComment): Promise<boolean>;
}

@injectable()
export class CommentService implements ICommentService {
    constructor(@inject(TYPES.ICommentRepository) private repository: ICommentRepository) {
        this.addComment = this.addComment.bind(this);
    }

    addComment(comment: IComment, postId: string): Promise<IComment> {
        if (!comment) {
            throw new ReferenceError('Commnet not provided!');
        }

        return this.repository.addCommentToPost(comment, postId);
    }
    
    async removeCommentById(commentId: string, postId: string, userId: string): Promise<boolean> {
        if (!commentId || !postId) {
            throw new ReferenceError('commentId or postId not provided!');
        }

        if (await this.repository.isCommentOfUser(commentId, userId)) {
            return this.repository.removeCommentFromPost(commentId, postId);
        }

        throw new Error('User don\'t own comment!');
    }

    updateComment(comment: IComment): Promise<boolean> {
        return this.repository.updateComment(comment);
    }
}
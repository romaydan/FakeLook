import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { IComment } from "../models/comment.model";
import { ICommentService } from "../services/comment.service";
import { INotificationService } from "../services/notification.service";

@injectable()
export default class CommentController {
    constructor(@inject(TYPES.ICommentService) private service: ICommentService,
        @inject(TYPES.INotificationService) private notifier: INotificationService) {
        this.addComment = this.addComment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
    }

    async addComment(req: Request, res: Response, next: NextFunction) {
        try {
            const comment: IComment = req.body.comment;
            const postId: string = req.body.postId;
            const newComment = await this.service.addComment(comment, postId);
            
            res.status(201).json(newComment);

            this.notifier.publish({ event: postId, type: 'ADD_COMMENT', payload: { comment: newComment, userId: req['userId'] } })
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(res, error) : null;
        }
    }

    async removeComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { commentId, postId } = req.body;
            const success = await this.service.removeCommentById(commentId, postId, req['userId']);
            
            res.json({ statusCode: 200, message: 'Comment was successfully removed!' });

            if (success)
                this.notifier.publish({ event: postId, type: 'REMOVE_COMMNET', payload: { commentId, userId: req['userId'] } });
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(res, error) : null;
        }
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { comment } = req.body;
            const success = await this.service.updateComment(comment);
            
            res.json({ statusCode: 200, message: 'Comment successfully updated!' });

            if (success)
                this.notifier.publish({ event: comment.postId, type: 'UPDATE_COMMENT', payload: { comment: comment, userId: req['userId'] } })
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(res, error) : null;
        }
    }

    private sendErrorResponse(res: Response, error: any) {
        switch (true) {
            case error instanceof ReferenceError:
                res.status(400).json({ statusCode: 400, message: error.message });
                break;
            default:
                res.status(500).json({ statusCode: 500, error: 'Unexpected error! please try again later...' });
                break;
        }
    }
}
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { INotificationService } from "../services/notification.service";
import { IUserTagService } from "../services/usertag.service";

@injectable()
export default class UserTagController {
    constructor(@inject(TYPES.IUserTagService) private service: IUserTagService,
        @inject(TYPES.INotificationService) private notifier: INotificationService) {
        this.addUserTagToPost = this.addUserTagToPost.bind(this);
        this.removeUserTagFromPost = this.removeUserTagFromPost.bind(this);
        this.getAllUserTagsForPost = this.getAllUserTagsForPost.bind(this);
    }

    async addUserTagToPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId, userId, name } = req.body;
            const usertag = await this.service.addUserTagToPost(userId, postId, name);

            res.json(usertag);

            this.notifier.publish({ event: postId, type: 'ADD_USERTAG', payload: { usertag, userId: req['userId'] } });
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(res, error) : null;
        }
    }

    async removeUserTagFromPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { taggedUserId, postId } = req.body;
            const success = await this.service.removeUserTagFromPost(taggedUserId, postId);

            res.json({ statusCode: 200, message: 'Usertag removed!' });
            
            if (success)
                this.notifier.publish({ event: postId, type: 'REMOVE_USERTAG', payload: { taggedUserId, postId, userId: req['userId'] } });
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(res, error) : null;
        }
    }

    async getAllUserTagsForPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId } = req.query;
            const usertags = await this.service.getAllPostUserTags(postId as string);

            res.json(usertags);
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
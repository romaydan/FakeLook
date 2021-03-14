import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { INotificationService } from "../services/notification.service";
import { ITagService } from "../services/tag.service";

@injectable()
export default class TagController {
    constructor(@inject(TYPES.ITagService) private service: ITagService,
        @inject(TYPES.INotificationService) private notifier: INotificationService) {
        this.addTag = this.addTag.bind(this);
        this.removeTagFromPost = this.removeTagFromPost.bind(this);
        this.getAllPostTags = this.getAllPostTags.bind(this);
    }

    async addTag(req: Request, res: Response, next: NextFunction) {
        try {
            const { tag, postId } = req.body;
            const newTag = await this.service.addTagToPost(tag, postId);

            res.json(newTag);

            this.notifier.publish({ event: postId, type: 'ADD_TAG', payload: { tag: newTag, userId: req['userId'] } })
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(res, error) : null;
        }
    }

    async removeTagFromPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { tagId, postId } = req.body;
            const success = await this.service.removeTagFromPost(tagId, postId);

            res.json({ statusCode: 200, message: 'Tag successfully removed!' });

            if (success)
                this.notifier.publish({ event: postId, type: 'REMOVE_TAG', payload: { postId, tagId, userId: req['userId'] } });
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(res, error) : null;
        }
    }

    async getAllPostTags(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId } = req.body;
            const tags = await this.service.getAllPostTagsById(postId);

            res.json(tags);
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
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { IUserTagService } from "../services/usertag.service";

@injectable()
export default class UserTagController {
    constructor(@inject(TYPES.IUserTagService) private service: IUserTagService) {
        this.addUserTagToPost = this.addUserTagToPost.bind(this);
        this.removeUserTagFromPost = this.removeUserTagFromPost.bind(this);
        this.getAllUserTagsForPost = this.getAllUserTagsForPost.bind(this);
    }

    async addUserTagToPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId, taggedUserId } = req.body;
            const usertag = await this.service.addUserTagToPost(taggedUserId, postId);

            res.json(usertag);

        } catch (error) {
            this.sendErrorResponse(res, error);
        }
    }

    async removeUserTagFromPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { taggedUserId, postId } = req.body;
            const success = await this.service.removeUserTagFromPost(taggedUserId, postId);

            res.json({ statusCode: 200, message: 'Usertag removed!' });

        } catch (error) {
            this.sendErrorResponse(res, error);
        }
    }

    async getAllUserTagsForPost(req: Request, res: Response, next: NextFunction) {
        try {
            const  { postId } = req.query;
            const usertags = await this.service.getAllPostUserTags(postId as string);
             
            res.json(usertags);
        } catch (error) {
            this.sendErrorResponse(res, error);
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
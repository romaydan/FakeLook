import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { ILikeService } from "../services/like.service";
import { INotificationService } from "../services/notification.service";

@injectable()
export default class LikeController {
    constructor(@inject(TYPES.ILikeService) private service: ILikeService,
        @inject(TYPES.INotificationService) private notifier: INotificationService) {
        this.addLike = this.addLike.bind(this);
        this.removeLike = this.removeLike.bind(this);
    }

    async addLike(req: Request, res: Response, next: NewableFunction) {
        try {
            const { postId, userId } = req.body;

            const like = await this.service.addLike(postId, userId);
            
            res.json(like);
            
            this.notifier.publish({ event: postId, type: 'ADD_LIKE', payload: { like, userId: req['userId'] } });
        } catch (error) {
            res.writableEnded ? res.status(500).json({ statusCode: 500, error: error }) : null
        }
    }

    async removeLike(req: Request, res: Response, next: NewableFunction) {
        try {
            const { postId } = req.query;

            const success = await this.service.removeLike(<string>postId, req['userId']);

            success ? res.json({ statusCode: 200, message: 'like removed!' }) : res.status(400).json({ statusCode: 400, error: 'you did not like this post!' });

            if (success)
                this.notifier.publish({ event: <string>postId, type: 'REMOVE_LIKE', payload: { postId, userId: req['userId'] } });
        } catch (error) {
           res.writableEnded ? res.status(500).json({ statusCode: 500, error: error }) : null
        }
    }
}
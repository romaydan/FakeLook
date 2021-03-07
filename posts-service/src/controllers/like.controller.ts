import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { ILikeService } from "../services/like.service";

@injectable()
export default class LikeController {
    constructor(@inject(TYPES.ILikeService) private service: ILikeService) {
        this.addLike = this.addLike.bind(this);
        this.removeLike = this.removeLike.bind(this);
    }

    async addLike(req: Request, res: Response, next: NewableFunction) {
        try {
            const { postId, userId } = req.body;

            const like = await this.service.addLike(postId, userId);
            res.json(like);

        } catch (error) {
            res.status(500).json({ statusCode: 500, error: error })
        }
    }

    async removeLike(req: Request, res: Response, next: NewableFunction) {
        try {
            const { postId, userId } = req.query;

            const success = await this.service.removeLike(<string>postId, <string>userId);

            success ? res.json({ statusCode: 200, message: 'like removed!' }) : res.status(400).json({ statusCode: 400, error: 'you did not like this post!' });

        } catch (error) {
            res.status(500).json({ statusCode: 500, error: error })
        }
    }
}
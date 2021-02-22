import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { IPostService } from "../services/post-service";

@injectable()
export default class PostController {
    constructor(@inject(TYPES.ICommentService) private service: IPostService) {
        this.getFilteredPosts = this.getFilteredPosts.bind(this);
    }

    getFilteredPosts(req: Request, res: Response, next: NextFunction) {
        const { users, tags } = req.body;

        const posts = this.service.getFilteredPosts(users ?? [], tags ?? []);

        res.status(200).json({ posts: posts });
    }
}
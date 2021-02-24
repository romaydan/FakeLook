import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { IPostService } from "../services/post.service";

@injectable()
export default class PostController {
    constructor(@inject(TYPES.ICommentService) private service: IPostService) {
        this.getFilteredPosts = this.getFilteredPosts.bind(this);
    }

    getFilteredPosts(req: Request, res: Response, next: NextFunction) {
        const { users, tags, publishers, location, distance, fromDate, toDate } = req.body;

        

        const to = toDate ?? new Date();
        const from = fromDate ?? new Date(new Date().setMonth(to.getMonth() - 2));
        const posts = this.service.getFilteredPosts(users ?? [], tags ?? [], publishers ?? [], distance, from, to);

        res.status(200).json({ posts: posts });
    }
}
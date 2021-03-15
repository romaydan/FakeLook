import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import UserError from "../errors/user.error";
import TYPES from "../ioc-container/types";
import { ILogger } from "../services/logger.service";
import { IPostService } from "../services/post.service";
import { ITagService } from "../services/tag.service";

@injectable()
export default class PostController {
    constructor(@inject(TYPES.IPostService) private service: IPostService,
        @inject(TYPES.ITagService) private tagService: ITagService,
        @inject(TYPES.ILogger) private logger: ILogger) {
        this.getFilteredPosts = this.getFilteredPosts.bind(this);
        this.addPost = this.addPost.bind(this);
        this.removePost = this.removePost.bind(this);
        this.getPostById = this.getPostById.bind(this);
        this.getAllUserPosts = this.getAllUserPosts.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    async getFilteredPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const { userTags, tags, publishers, location, distance, fromDate, toDate } = req.query;

            const to: Date = !isNaN(new Date(<string>toDate).getTime()) ? new Date(<string>toDate) : new Date(),
                from: Date = !isNaN(new Date(<string>fromDate).getTime()) ? new Date(<string>fromDate) : new Date(new Date().setMonth(to.getMonth() - 2));

            const dis = parseFloat(<string>distance),
                loc = (<string[]>location).map(i => parseFloat(i));

            const posts = await this.service.getFilteredPosts(<string[]>userTags, <string[]>tags, <string[]>publishers, loc, dis, from, to);

            res.json(posts);

            this.logger.log({ userId: req['userId'], action: 'posts fetching', status: 'successfull' });
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(error, res, 'posts fetching', req['userId']) : null;
        }
    }

    async getPostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId } = req.params;
            const post = await this.service.getPostById(postId as string);

            res.json(post);

            this.logger.log({ userId: req['userId'], action: 'fetchin post by id', status: 'successfull' })
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(error, res, 'fetching post by id', req['userId']) : null;
        }
    }

    async addPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { coordinates, textContent, tags, userTags, showTo, photo: file } = req.body;
            const publisherId = req['userId'];
            const { authorization: token } = req.headers

            const [long, lat] = coordinates.split(',').map(val => parseFloat(val));

            const post = await this.service.addPost({
                publisherId,
                location: {
                    type: 'Point',
                    coordinates: [long, lat]
                },
                textContent,
                showTo,
                imageUrl: '',
                userTags: JSON.parse(userTags)
            }, file, token);

            await this.tagService.addTagsToPost(JSON.parse(tags), post.id);

            res.json(post);

            this.logger.log({ action: 'adding post', status: 'successfull', userId: req['userId'] });
        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(error, res, 'adding post', req['userId']) : null;
        }
    }

    async removePost(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId } = req.query;
            const { authorization: token } = req.headers;

            const success = await this.service.removePostById(postId as string, req['userId'], token);

            if (success) {
                res.json({ statusCode: 200, message: 'The post was removed successfully!' });
                this.logger.log({ action: 'remove post', status: 'successfull', userId: req['userId'] })

                return;
            }

            res.status(500).json({ statusCode: 500, message: 'Unable to remove post at this time!' })
            this.logger.log({ action: 'remove post', status: 'unsuccessfull', userId: req['userId'], reason: 'internal server error' });

        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(error, res, 'remove post', req['userId']) : null;
        }
    }

    async getAllUserPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const posts = await this.service.getAllPostsByUserId(userId as string);

            res.json(posts);

        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(error, res, 'fetching user posts', req['userId']) : null;
        }
    }

    async updatePost(req: Request, res: Response, next: NextFunction) {
        try {
            const post = req.body;
            const success = await this.service.updatePost(post);

            if (success) {
                res.json({ statusCode: 200, message: 'Post successfully updated!' });
                return;
            }

            res.status(500).json({ statusCode: 500, error: 'Unable to update post at this time!' });

        } catch (error) {
            res.writableEnded ? this.sendErrorResponse(error, res, 'update post', req['userId']) : null;
        }
    }

    private sendErrorResponse(error: any, res: Response, action: string, userId: string) {
        const errorLog: any = { userId, action, status: 'unsuccessfull' };

        switch (true) {
            case error instanceof ReferenceError:
            case error instanceof UserError:
                res.status(400).json({ statusCode: 400, error: error.message });
                errorLog.error = error.message;
                break;
            default:
                const msg = error.message ?? 'Uexpected error! please try again later!';
                res.status(500).json({ statusCode: 500, error: msg });
                errorLog.error = msg;
                break;
        }

        this.logger.error(errorLog);
    }
}
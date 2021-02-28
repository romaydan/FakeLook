import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { IPostService } from "../services/post.service";

@injectable()
export default class PostController {
    constructor(@inject(TYPES.IPostService) private service: IPostService) {
        this.getFilteredPosts = this.getFilteredPosts.bind(this);
        this.addPost = this.addPost.bind(this);
        this.removePost = this.removePost.bind(this);
        this.getPostById = this.getPostById.bind(this);
        this.getAllUserPosts = this.getAllUserPosts.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    async getFilteredPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const { users, tags, publishers, location, distance, fromDate, toDate } = req.body;

            const to = toDate ?? new Date();
            const from = fromDate ?? new Date(new Date().setMonth(to.getMonth() - 2));
            const posts = await this.service.getFilteredPosts(users, tags, publishers, distance, from, to);

            res.json({ posts: posts });
        } catch (error) {
            this.sendErrorResponse(error, res);
        }
    }

    async getPostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId } = req.params
            const post = await this.service.getPostDataById(postId as string);

            res.json(post);
        } catch (error) {
            this.sendErrorResponse(error, res);
        }
    }

    async addPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { publisherId, coordinates, textContent, showTo, photo: file } = req.body;
            const { authorization: token } = req.headers

            const [lat, long] = coordinates.split(',').map(val => parseFloat(val));

            const post = await this.service.addPost({
                publisherId,
                location: {
                    type: 'Point',
                    coordinates: [long, lat]
                },
                textContent,
                showTo,
                imageUrl: ''
            }, file, token);

            res.json(post);

        } catch (error) {
            this.sendErrorResponse(error, res);
        }
    }

    async removePost(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId } = req.query;
            const { authorization: token } = req.headers;

            const success = await this.service.removePostById(postId as string, token);

            if (success) {
                res.json({ statusCode: 200, message: 'The post was removed successfully!' });
                return;
            }

            res.status(500).json({ statusCode: 500, message: 'Unable to remove post at this time!' })

        } catch (error) {
            this.sendErrorResponse(error, res);
        }
    }

    async getAllUserPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const posts = await this.service.getAllPostsByUserId(userId as string);

            res.json(posts);

        } catch (error) {
            this.sendErrorResponse(error, res);
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
            this.sendErrorResponse(error, res);
        }
    }

    private sendErrorResponse(error: any, res: Response) {
        switch (true) {
            case error instanceof ReferenceError:
                res.status(400).json({ statusCode: 400, error: error.message });
                break;
            default:
                res.status(500).json({ statusCode: 500, error: error.message ?? 'Uexpected error! please try again later!' });
                break;
        }
    }
}
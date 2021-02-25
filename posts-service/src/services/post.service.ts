import { inject, injectable } from "inversify";
import { IPostRepository } from "../repositories/post.repository";
import { IImageUploader } from "./image.uploader";
import { IPost } from "../models/post.model";
import TYPES from "../ioc-container/types";
import uuid from 'uuid';


export interface IPostService {
    addPost(post: IPost, uploadFile: object, accessToken: string): Promise<IPost>;
    removePostById(postId: string, accessToken: string): Promise<boolean>;
    getFilteredPosts(userFilter: string[], tagFilter: string[], publishers: string[], distance: number, from: Date, to: Date): Promise<IPost[]>;
    getPostDataById(postId: string): Promise<IPost>;
    getAllPostsByUserId(userId: string): Promise<IPost[]>;
    updatePost(post: IPost): Promise<boolean>;
}

@injectable()
export class PostService implements IPostService {
    constructor(@inject(TYPES.IPostRepository) private repository: IPostRepository,
        @inject(TYPES.IImageUploader) private uploader: IImageUploader) {
        this.addPost = this.addPost.bind(this);
        this.removePostById = this.removePostById.bind(this);
        this.getFilteredPosts = this.getFilteredPosts.bind(this);
        this.getPostDataById = this.getPostDataById.bind(this);
        this.getAllPostsByUserId = this.getAllPostsByUserId.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    async addPost(post: IPost, uploadFile: any, accessToken: string): Promise<IPost> {
        if (!post) {
            throw new ReferenceError('No post proivded!');
        }

        post.id = uuid.v4();
        post.imageUrl = await this.uploader.uploadImage(post.publisherId, post.id, uploadFile, accessToken);

        return this.repository.addPost(post);
    }

    async removePostById(postId: string, accessToken: string): Promise<boolean> {
        if (!postId) {
            throw new ReferenceError('No post id proivded!');
        }

        const post = await this.repository.removePost(postId);
        const success = await this.uploader.deleteImage(post.imageUrl, accessToken);

        return post != undefined;
    }

    getFilteredPosts(userFilter: string[], tagFilter: string[], publishers: string[], distance: number, from: Date, to: Date): Promise<IPost[]> {
        return this.repository.getFilteredPost(userFilter, tagFilter, publishers, distance, from, to);
    }

    getPostDataById(postId: string): Promise<IPost> {
        return this.repository.getPostById(postId);
    }

    getAllPostsByUserId(userId: string): Promise<IPost[]> {
        return this.repository.getAllPostsByUserId(userId);
    }

    updatePost(post: IPost): Promise<boolean> {
        return this.repository.updatePost(post);
    }
}
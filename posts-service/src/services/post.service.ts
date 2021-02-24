import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { IPost } from "../models/post.model";
import { IPostRepository } from "../repositories/post.repository";


export interface IPostService {
    addPost(post: IPost): Promise<IPost>;
    removePostById(postId: string): Promise<boolean>;
    getFilteredPosts(userFilter: string[], tagFilter: string[], publishers: string[], distance: number, from: Date, to: Date): Promise<IPost[]>;
    getPostDataById(postId: string): Promise<IPost>;
    getAllPostsByUserId(userId: string): Promise<IPost[]>;
    updatePost(post: IPost): Promise<boolean>;
}

@injectable()
export class PostService implements IPostService {
    constructor(@inject(TYPES.IPostRepository) private repository: IPostRepository) {
        this.addPost = this.addPost.bind(this);
        this.removePostById = this.removePostById.bind(this);
        this.getFilteredPosts = this.getFilteredPosts.bind(this);
        this.getPostDataById = this.getPostDataById.bind(this);
        this.getAllPostsByUserId = this.getAllPostsByUserId.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    addPost(post: IPost): Promise<IPost> {
        if (!post) {
            throw new ReferenceError('No post proivded!');
        }

        return this.repository.addPost(post);
    }

    removePostById(postId: string): Promise<boolean> {
        if (!postId) {
            throw new ReferenceError('No post id proivded!');
        }

        return this.repository.removePost(postId);
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
import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { ILike } from "../models/like.model";
import { ILikeRepository } from "../repositories/like.repository";


export interface ILikeService {
    addLike(postId: string, userId: string): Promise<ILike>;
    removeLike(postId: string, userId: string): Promise<boolean>;
}

@injectable()
export class LikeService implements ILikeService {
    constructor(@inject(TYPES.ILikeRepository) private repository: ILikeRepository){
        this.addLike = this.addLike.bind(this);
        this.removeLike = this.removeLike.bind(this);
    }

    addLike(postId: string, userId: string): Promise<ILike> {
        return this.repository.addLike(postId, userId);
    }
    removeLike(postId: string, userId: string): Promise<boolean> {
        return this.repository.removeLike(postId, userId);
    }
}
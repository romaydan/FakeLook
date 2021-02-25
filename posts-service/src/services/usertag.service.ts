import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { IUserTag } from "../models/usertag.model";
import { IUserTagRepository } from "../repositories/usertag.repository";

export interface IUserTagService {
    addUserTagToPost(userId: string, posId: string) : Promise<IUserTag>;
    removeUserTagFromPost(userTagId: string, postId: string): Promise<boolean>;
    getAllPostUserTags(postId: string): Promise<IUserTag[]>;
}

@injectable()
export class UserTagService implements IUserTagService {
    constructor(@inject(TYPES.IUserTagRepository) private repository: IUserTagRepository) {
        this.addUserTagToPost = this.addUserTagToPost.bind(this);
        this.removeUserTagFromPost = this.removeUserTagFromPost.bind(this);
    }

    addUserTagToPost(userId: string, postId: string): Promise<IUserTag> {
        return this.repository.addUserTagToPost({
            userId,
            postId
        });
    }

    removeUserTagFromPost(userTagId: string, postId: string): Promise<boolean> {
        return this.repository.removeUserTagFromPost(userTagId, postId);
    }

    getAllPostUserTags(postId: string): Promise<IUserTag[]> {
        return this.repository.getAllUserTagsByPostId(postId);
    }
}
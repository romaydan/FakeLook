import { inject, injectable } from "inversify";
import TYPES from "../ioc-container/types";
import { ITag } from "../models/tag.model";
import { ITagRepository } from "../repositories/tag.repository";

export interface ITagService {
    addTagsToPost(tags: ITag[], postId: string): Promise<ITag[]>;
    addTagToPost(tag: ITag, postId: string): Promise<ITag>;
    removeTagFromPost(tagId: string, postId: string): Promise<boolean>;
    getAllPostTagsById(postId: string): Promise<ITag[]>;
}

@injectable()
export class TagService implements ITagService {
    constructor(@inject(TYPES.ITagRepostiroy) private repository: ITagRepository) {
        this.addTagToPost = this.addTagToPost.bind(this);
        this.removeTagFromPost = this.removeTagFromPost.bind(this);
        this.getAllPostTagsById = this.getAllPostTagsById.bind(this);
    }

    addTagsToPost(tags: ITag[], postId: string) {
        return this.repository.addTagsToPost(tags, postId);
    }

    addTagToPost(tag: ITag, postId: string): Promise<ITag> {
        return this.repository.addTagToPost(tag, postId);
    }

    removeTagFromPost(tagId: string, postId: string): Promise<boolean> {
        return this.repository.removeTagFromPost(tagId, postId);
    }

    getAllPostTagsById(postId: string): Promise<ITag[]> {
        return this.repository.getAllTagsByPostId(postId);
    }
}
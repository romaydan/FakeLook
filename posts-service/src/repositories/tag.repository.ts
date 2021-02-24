import { ITag, PostTag, Tag } from "../models/tag.model";
import uuid from 'uuid';
import { Post } from "../models/post.model";
import { injectable } from "inversify";

export interface ITagRepository {
    addTagToPost(tag: ITag, postId: string): Promise<ITag>;
    removeTagFromPost(tagId: string, postId: string): Promise<boolean>
    getAllTagsByPostId(postId: string): Promise<ITag[]>
}

@injectable()
export class TagRepository implements ITagRepository {
    constructor() {
        this.addTagToPost = this.addTagToPost.bind(this);
        this.removeTagFromPost = this.removeTagFromPost.bind(this);
        this.getAllTagsByPostId = this.getAllTagsByPostId.bind(this);
    }

    async addTagToPost(tag: ITag, postId: string): Promise<ITag> {
        const t = await Tag.findOne({
            where: {
                content: tag.content
            }
        });

        if (t) {
            await new PostTag({ tagId: t.id, postId: postId }).save();
            return t;
        }

        const newTag = await new Tag({ id: uuid.v4(), ...tag }).save();
        await new PostTag({ tagId: newTag.id, postId: postId }).save();

        return newTag;
    }

    async removeTagFromPost(tagId: string, postId: string): Promise<boolean> {
        const count = await PostTag.destroy({
            where: {
                postId: postId,
                tagId: tagId
            }
        });

        return count > 0;
    }

    getAllTagsByPostId(postId: string): Promise<ITag[]> {
        return Tag.findAll({
            include: {
                model: Post,
                attributes: [],
                where: {
                    id: postId
                }
            }
        });
    }

}
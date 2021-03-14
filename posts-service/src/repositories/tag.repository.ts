import { ITag, PostTag, Tag } from "../models/tag.model";
import * as uuid from 'uuid';
import { Post } from "../models/post.model";
import { injectable } from "inversify";
import { Op } from 'sequelize';

export interface ITagRepository {
    addTagToPost(tag: ITag, postId: string): Promise<ITag>;
    addTagsToPost(tags: ITag[], postId: string): Promise<ITag[]>;
    removeTagFromPost(tagId: string, postId: string): Promise<boolean>
    getAllTagsByPostId(postId: string): Promise<ITag[]>;
}

@injectable()
export class TagRepository implements ITagRepository {
    constructor() {
        this.addTagToPost = this.addTagToPost.bind(this);
        this.removeTagFromPost = this.removeTagFromPost.bind(this);
        this.getAllTagsByPostId = this.getAllTagsByPostId.bind(this);
        this.addTags = this.addTags.bind(this);
        this.addTagsToPost = this.addTagsToPost.bind(this);
    }

    private async addTags(tags: ITag[]): Promise<ITag[]> {
        const existingTags = await Tag.findAll({
            where: {
                content: { [Op.in]: tags.map(t => t.content) }
            }
        })

        tags = tags.filter(tag => !existingTags.find(t => t.content === tag.content));

        const newTags = [];
        
        for (const tag of tags) {
           newTags.push(await Tag.create({...tag, id: uuid.v4()}));
        }

        return [...newTags, ...existingTags];
    }

    async addTagToPost(tag: ITag, postId: string): Promise<ITag> {
        const t = await Tag.findOne({
            where: {
                content: tag.content
            }
        });

        if (t) {
            await new PostTag({ tagId: t.id, postId: postId, id: uuid.v4() }).save();
            return t;
        }

        const newTag = await new Tag({ id: uuid.v4(), ...tag }).save();
        await new PostTag({ tagId: newTag.id, postId: postId }).save();

        return newTag;
    }

    async addTagsToPost(tags: ITag[], postId: string): Promise<ITag[]> {
        const tagsToAdd = await this.addTags(tags);

        for (const tag of tagsToAdd) {
            await PostTag.create({ postId, tagId: tag.id, id: uuid.v4() });
        }

        return tagsToAdd;
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
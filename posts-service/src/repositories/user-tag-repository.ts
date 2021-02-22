import { injectable } from "inversify";
import { IUserTag, UserTag } from "../models/user-tag.model";
import uuid from 'uuid';

export interface IUserTagRepository {
    addUserTagToPost(userTag: IUserTag, postId: string): Promise<IUserTag>;
    removeUserTagFromPost(userTagId: string, postId: string): Promise<boolean>;
    getAllUserTagsByPostId(postId: string): Promise<IUserTag[]>
}

@injectable()
export class UserTagRepository implements IUserTagRepository {
    constructor() {
        this.addUserTagToPost = this.addUserTagToPost.bind(this);
        this.getAllUserTagsByPostId = this.getAllUserTagsByPostId.bind(this);
        this.removeUserTagFromPost = this.removeUserTagFromPost.bind(this);
    }

    addUserTagToPost(userTag: IUserTag, postId: string): Promise<IUserTag> {
        return UserTag.create({ id: uuid.v4(), ...userTag, postId: postId });
    }

    async removeUserTagFromPost(userTagId: string, postId: string): Promise<boolean> {
        const count = await UserTag.destroy({
            where: {
                id: userTagId,
                postId: postId
            }
        })

        return count > 0;
    }
    getAllUserTagsByPostId(postId: string): Promise<IUserTag[]> {
        return UserTag.findAll({
            where: {
                postId: postId
            }
        })
    }

}




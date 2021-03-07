import { injectable } from "inversify";
import { ILike, Like } from "../models/like.model";
import { Op } from 'sequelize';
import * as uuid from 'uuid';

export interface ILikeRepository {
    addLike(postId: string, userId: string): Promise<ILike>;
    removeLike(postId: string, userId: string): Promise<boolean>;
}


@injectable()
export class LikeRepository implements ILikeRepository {
    constructor() {
        this.addLike = this.addLike.bind(this);
        this.removeLike = this.removeLike.bind(this);
    }

    async addLike(postId: string, userId: string): Promise<ILike> {
        const exsitingLike = await Like.findOne({
            where: {
                postId: { [Op.eq]: postId },
                userId: { [Op.eq]: userId }
            }
        });

        if (exsitingLike) {
            return exsitingLike;
        }

        return await new Like({ id: uuid.v4(), userId, postId }).save();
    }

    async removeLike(postId: string, userId: string): Promise<boolean> {
        const count = await Like.destroy({
            where: {
                postId: { [Op.eq]: postId },
                userId: { [Op.eq]: userId }
            }
        })

        return count > 0;
    }
}
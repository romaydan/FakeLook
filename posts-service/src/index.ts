import express from 'express';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import container from './ioc-container';
import TYPES from './ioc-container/types';
import { Comment } from './models/comment.model';
import { Like } from './models/like.model';
import { Post, ShowOptions } from './models/post.model';
import { PostTag, Tag } from './models/tag.model';
import { UserTag } from './models/user-tag.model';
import jwtValidation from './middlewares/jwt-validation';

const PORT = process.env.PORT || 5001;
const app = express();

const db = container.get<Sequelize>(TYPES.Sequelize);

const dbTest = async () => {
    const post = await Post.create({ id: '1', textContent: 'test', imageUrl: 'test url', location: '', showTo: ShowOptions.Followers, userId: '123' });
    const userTag = await UserTag.create({ id: '3', userId: '1234', postId: '1' })
    const tag = await Tag.create({ id: '2', content: 'test tag' });
    const like = await Like.create({ id: '4', postId: '1', userId: '1234' })
    const pt = await PostTag.create({ postId: post.id, tagId: tag.id });

    const posts = await Post.findAll({
        include: [{
            model: Tag,
            through: {
                attributes: [],
                where: {
                    tagId: {
                        [Op.in]: [tag.id]
                    }
                }
            }
        },
        {
            model: UserTag,
            where: [].length ? {
                id: {
                    [Op.in]: []
                }
            }
                : {}
        },
            Like, Comment]
    });

    const tags = await Tag.findAll({
        include: {
            model: Post,
            attributes: [],
            where: {
                id: post.id
            }
        }
    });

    console.log(tags);

}

db.sync({ force: true })
    .then(async () => {

        app.use(jwtValidation);

        app.listen(PORT, () => {
            console.log(`Listening on port: ${PORT}...`);
        });

        await dbTest();
    })
    .catch(async err => {
        await db.close();

        console.error(err);
        process.exit(1);
    })

process.on('beforeExit', async () => {
    await db.close();
    console.log('db closed! can exit')
})
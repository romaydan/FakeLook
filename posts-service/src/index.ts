import env from 'dotenv';
import express from 'express';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import container from './ioc-container';
import TYPES from './ioc-container/types';
import { Comment } from './models/comment.model';
import { Like } from './models/like.model';
import { Post, ShowOptions } from './models/post.model';
import { PostTag, Tag } from './models/tag.model';
import { UserTag } from './models/usertag.model';
import jwtValidation from './middlewares/jwt.validation';
import sequelize from 'sequelize';
import postRouter from './routers/post.router';
import commentRouter from './routers/comment.router';
import usertagRouter from './routers/usertag.router';
import tagRouter from './routers/tag.router';

env.config();

const PORT = process.env.PORT || 5001;
const app = express();

const db = container.get<Sequelize>(TYPES.Sequelize);

const dbTest = async () => {
    const post = await Post.create({ id: '1', textContent: 'test', imageUrl: 'test url', showTo: ShowOptions.Followers, publisherId: '123', location: { type: 'Point', coordinates: [34.87711793780242, 32.02717259144145] } });
    const userTag = await UserTag.create({ id: '3', userId: '1234', postId: '1' })
    const tag = await Tag.create({ id: '2', content: 'test tag' });
    const like = await Like.create({ id: '4', postId: '1', userId: '1234' })
    const pt = await PostTag.create({ postId: post.id, tagId: tag.id });

    const to = new Date();
    const from = new Date(new Date().setMonth(to.getMonth() - 1));

    const posts = await Post.findAll({
        include: [{
            model: Tag,
            attributes: [],
            through: {
                attributes: [], where: []?.length > 0 ? { tagId: { [Op.in]: [] } } : { tagId: { [Op.not]: null } },
            }
        },
        {
            model: UserTag,
            attributes: [],
            where: []?.length > 0 ? { userId: { [Op.in]: [] } } : { userId: { [Op.not]: null } }
        }, Like, Comment],
        where: {
            [Op.and]: [
                (sequelize.fn('ST_DWithin', sequelize.col('location'), sequelize.fn('ST_SetSRID', sequelize.fn('ST_MakePoint', 34.8754289039092, 32.02753787187709), 4326), 1000, false)),
                {
                    createdAt: {
                        [Op.gte]: from,
                        [Op.lte]: to
                    }
                },
                {
                    publisherId: [1]?.length > 0 ? { [Op.in]: ['3'] } : { [Op.not]: null }
                }
            ]
        }
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
    console.log(JSON.stringify(posts[0]))
    console.log(tags);

}

db.sync({ force: true })
    .then(async () => {
        app.use(jwtValidation);
        app.use('/posts', postRouter);
        app.use('/commets', commentRouter);
        app.use('/usertags', usertagRouter);
        app.use('/tags', tagRouter);

        app.listen(PORT, () => {
            console.log(`Listening on port: ${PORT}...`);
        });

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
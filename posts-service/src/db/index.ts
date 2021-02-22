import { Sequelize } from 'sequelize-typescript';
import { Like } from '../models/like.model';
import { Post } from '../models/post.model';
import { Tag, PostTag } from '../models/tag.model';
import { Comment } from '../models/comment.model';
import { UserTag } from '../models/user-tag.model';

const db = new Sequelize({
    dialect: 'sqlite',
    storage: `${__dirname}\\data\\postsDb.db`
});

db.addModels([PostTag, Post, Like, Tag, Comment, UserTag]);

export default db;
import { Sequelize } from 'sequelize-typescript';
import { Like } from '../models/like.model';
import { Post } from '../models/post.model';
import { Tag, PostTag } from '../models/tag.model';
import { Comment } from '../models/comment.model';
import { UserTag } from '../models/usertag.model';

const db = new Sequelize('posts', 'postgres', '123456', {
    dialect: 'postgres',
    host: '127.0.0.1',
    port: 63847
});

db.addModels([PostTag, Post, Like, Tag, Comment, UserTag]);

export default db;
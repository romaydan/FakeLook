import { Sequelize } from 'sequelize-typescript';
import { Like } from '../models/like.model';
import { Post } from '../models/post.model';
import { Tag, PostTag } from '../models/tag.model';
import { Comment } from '../models/comment.model';
import { UserTag } from '../models/usertag.model';

const db = new Sequelize('posts', 'postgres', process.env.POSTGRES_PASSWORD, {
  dialect: 'postgres',
  host: process.env.POSTGRES_IP,
  port: Number(process.env.POSTGRES_PORT),
  logging: (sql, timing) => {},
});

db.addModels([PostTag, Post, Like, Tag, Comment, UserTag]);

export default db;

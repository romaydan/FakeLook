import "reflect-metadata";
import { Container } from "inversify";
import { Sequelize } from "sequelize/types";
import PostController from "../controllers/post.controller";
import { CommentRepository, ICommentRepository } from "../repositories/comment.repository";
import { IPostRepository, PostRepository } from "../repositories/post.repository";
import { ITagRepository, TagRepository } from "../repositories/tag.repository";
import { IUserTagRepository, UserTagRepository } from "../repositories/usertag.repository";
import { CommentService, ICommentService } from "../services/comment.service";
import { IPostService, PostService } from "../services/post.service";
import { IImageUploader, ImageUploader } from "../services/image.uploader";
import { IUserTagService, UserTagService } from "../services/usertag.service";
import TYPES from "./types";
import db from "../db";
import { ITagService, TagService } from "../services/tag.service";
import CommentController from "../controllers/comment.controller";
import UserTagController from "../controllers/usertag.controller";
import TagController from "../controllers/tag.controller";
import { ILikeRepository, LikeRepository } from "../repositories/like.repository";
import { ILikeService, LikeService } from "../services/like.service";
import LikeController from "../controllers/like.controller";
import { INotificationService, NotificationService } from "../services/notification.service";
import { ILogger, RedisPubSubLogger } from "../services/logger.service";

const container = new Container();

//db
container.bind<Sequelize>(TYPES.Sequelize).toDynamicValue(() => db).inSingletonScope();

//repositories
container.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository).inSingletonScope();
container.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository).inSingletonScope();
container.bind<ITagRepository>(TYPES.ITagRepostiroy).to(TagRepository).inSingletonScope();
container.bind<IUserTagRepository>(TYPES.IUserTagRepository).to(UserTagRepository).inSingletonScope();
container.bind<ILikeRepository>(TYPES.ILikeRepository).to(LikeRepository).inSingletonScope();

container.bind<IPostService>(TYPES.IPostService).to(PostService).inSingletonScope();
container.bind<ICommentService>(TYPES.ICommentService).to(CommentService).inSingletonScope();
container.bind<IUserTagService>(TYPES.IUserTagService).to(UserTagService).inSingletonScope();
container.bind<ITagService>(TYPES.ITagService).to(TagService).inSingletonScope();
container.bind<IImageUploader>(TYPES.IImageUploader).to(ImageUploader).inSingletonScope();
container.bind<ILikeService>(TYPES.ILikeService).to(LikeService).inSingletonScope();
container.bind<INotificationService>(TYPES.INotificationService).to(NotificationService).inSingletonScope();
container.bind<ILogger>(TYPES.ILogger).to(RedisPubSubLogger).inSingletonScope();

container.bind<PostController>(TYPES.PostController).to(PostController).inTransientScope();
container.bind<CommentController>(TYPES.CommentController).to(CommentController).inTransientScope();
container.bind<UserTagController>(TYPES.UserTagController).to(UserTagController).inTransientScope();
container.bind<TagController>(TYPES.TagController).to(TagController).inTransientScope();
container.bind<LikeController>(TYPES.LikeController).to(LikeController).inTransientScope();

export default container;
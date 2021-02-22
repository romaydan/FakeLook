import { Container } from "inversify";
import { Sequelize } from "sequelize/types";
import db from "../db";
import { CommentRepository, ICommentRepository } from "../repositories/comment-repository";
import { IPostRepository, PostRepository } from "../repositories/post-repository";
import { ITagRepository, TagRepository } from "../repositories/tag-repository";
import { IUserTagRepository, UserTagRepository } from "../repositories/user-tag-repository";
import { CommentService, ICommentService } from "../services/comment-service";
import { IPostService, PostService } from "../services/post-service";
import TYPES from "./types";

const container = new Container();

//db
container.bind<Sequelize>(TYPES.Sequelize).toDynamicValue(() => db).inSingletonScope();

//repositories
container.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository).inSingletonScope();
container.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository).inSingletonScope();
container.bind<ITagRepository>(TYPES.ITagRepostiroy).to(TagRepository).inSingletonScope();
container.bind<IUserTagRepository>(TYPES.IUserTagRepository).to(UserTagRepository).inSingletonScope();

container.bind<IPostService>(TYPES.IPostService).to(PostService).inSingletonScope();
container.bind<ICommentService>(TYPES.ICommentService).to(CommentService).inSingletonScope();


export default container;
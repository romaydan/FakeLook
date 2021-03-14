const TYPES = {
    IPostRepository: Symbol('IPostRepository'),
    ILikeRepository: Symbol('ILikeRepository'),
    ITagRepostiroy: Symbol('ITagRepostiroy'),
    ICommentRepository: Symbol('ICommentRepository'),
    IUserTagRepository: Symbol('IUserTagRepository'),

    IPostService: Symbol('IPostService'),
    ILikeService: Symbol('ILikeService'),
    ICommentService: Symbol('ICommentService'),
    IUserTagService: Symbol('IUserTagService'),
    ITagService: Symbol('ITagService'),
    IImageUploader: Symbol('IImageUploader'),
    INotificationService: Symbol('INotificationService'),
    ILogger: Symbol('ILogger'),
    
    Sequelize: Symbol('Sequelize'),

    PostController: Symbol('PostController'),
    LikeController: Symbol('LikeController'),
    CommentController: Symbol('CommentController'),
    UserTagController: Symbol('UserTagController'),
    TagController: Symbol('TagController'),
}

export default TYPES;
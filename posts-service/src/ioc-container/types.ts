const TYPES = {
    IPostRepository: Symbol('IPostRepository'),
    ITagRepostiroy: Symbol('ITagRepostiroy'),
    ICommentRepository: Symbol('ICommentRepository'),
    IUserTagRepository: Symbol('IUserTagRepository'),

    IPostService: Symbol('IPostService'),
    ICommentService: Symbol('ICommentService'),
    IUserTagService: Symbol('IUserTagService'),
    ITagService: Symbol('ITagService'),
    IImageUploader: Symbol('IImageUploader'),
    
    Sequelize: Symbol('Sequelize'),

    PostController: Symbol('PostController'),
    CommentController: Symbol('CommentController'),
    UserTagController: Symbol('UserTagController'),
    TagController: Symbol('TagController'),
}

export default TYPES;
const TYPES = {
    IPostRepository: Symbol('IPostRepository'),
    ITagRepostiroy: Symbol('ITagRepostiroy'),
    ICommentRepository: Symbol('ICommentRepository'),
    IUserTagRepository: Symbol('IUserTagRepository'),

    IPostService: Symbol('IPostService'),
    ICommentService: Symbol('ICommentService'),
    
    Sequelize: Symbol('Sequelize')
}

export default TYPES;
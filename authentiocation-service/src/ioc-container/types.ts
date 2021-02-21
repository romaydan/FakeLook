export const TYPES = {
    Sequelize: Symbol('Sequelize'),
    IUserRepository: Symbol('IFakLookUserRepository'),
    IRefreshTokenRepository: Symbol('IRefreshTokenRepository'),
    
    IJwtService : Symbol('IJwtService'),
    ITokenBlackListService: Symbol('ITokenBlackListService'),
    IEmailValidator: Symbol('IEmailValidator'),

    IFakeLookAuthenticationService : Symbol('IFakeLookAuthenticationService'),
    FakeLookAuthController: Symbol('FakeLookAuthController'),

    GoogleAuthController: Symbol('GoogleAuthController'),
    IGoogleAuthenticationService: Symbol('IGoogleAuthenticationService'),

    IFacebookAuthenticationService: Symbol('IFacebookAuthenticationService'),
    FacebookAuthController: Symbol('FacebookAuthController'),

    JwtController: Symbol('JwtController')
}
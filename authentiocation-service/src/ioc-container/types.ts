export const TYPES = {
    Sequelize: Symbol('Sequelize'),
    IUserRepository: Symbol('IFakLookUserRepository'),
    
    IJwtService : Symbol('IJwtService'),

    IFakeLookAuthenticationService : Symbol('IFakeLookAuthenticationService'),
    FakeLookAuthController: Symbol('FakeLookAuthController'),

    GoogleAuthController: Symbol('GoogleAuthController'),
    IGoogleAuthenticationService: Symbol('IGoogleAuthenticationService'),

    IFacebookAuthenticationService: Symbol('IFacebookAuthenticationService'),
    FacebookAuthController: Symbol('FacebookAuthController')
}
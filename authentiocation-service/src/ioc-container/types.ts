export const TYPES = {
    Sequelize: Symbol('Sequelize'),
    IFakeLookUserRepository: Symbol('IFakLookUserRepository'),
    IFacebookUserRepository: Symbol('IFacebookUserRepository'),
    
    IJwtService : Symbol('IJwtService'),

    IFakeLookAuthenticationService : Symbol('IFakeLookAuthenticationService'),
    FakeLookAuthController: Symbol('FakeLookAuthController'),

    GoogleAuthController: Symbol('GoogleAuthController'),
    IGoogleAuthenticationService: Symbol('IGoogleAuthenticationService'),

    IFacebookAuthenticationService: Symbol('IFacebookAuthenticationService'),
    FacebookAuthController: Symbol('FacebookAuthController')
}
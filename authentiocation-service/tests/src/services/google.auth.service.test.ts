import { IUser } from '../../../src/models/user.model';
import { UserRepository } from '../../../src/repositories/user.repository';
import { GoogleAuthenticationService } from '../../../src/services/google.authentication.service';


let users : IUser[];

jest.mock('password-hash', () => {
    return ({
        verify: (password: string, hashedPassword: string): boolean => {
            const success = password == hashedPassword;
            return success;
        },
        generate: (password: string): string => password
    })
});

jest.mock('google-auth-library', () => {
    return ({
        OAuth2Client: jest.fn((...args) => {
            return ({
                verifyIdToken: (options: any) => {
                    if(options.idToken !== 'token') {
                        throw new Error();
                    } 

                    return ({
                        getPayload: () => ({
                            email: 'test@gmail.com'
                        })
                    });
                }
            })
        })
    })
})

jest.mock('../../../src/repositories/user.repository');

const mockRepository = <jest.Mock<UserRepository>>UserRepository;
mockRepository.mockImplementation(() => ({
    addUser(user: IUser): Promise<IUser> {
        if(!user.identifier || !user.password) {
            throw new Error();
        }

        if(users.find(u => u.identifier === user.identifier)) {
            throw new Error('Email in use');
        }
        const newUser = { id: '3', identifier: user.identifier, password: user.password, isOAuthUser: true };
        users.push(newUser);

        return Promise.resolve(newUser);
    },
    getByUserIdentifier(identifier: string): Promise<IUser> {
        return Promise.resolve(users.find(u => u.identifier === identifier));
    },
    UpdateUser: (user: IUser) => {
        const index = users.findIndex(u => u.id === user.id);
        if(index >= 0) {
            users[0] = user;
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}) as UserRepository);

describe('testing signIn', () => {
    beforeEach(() => {
        users = [
            {
                id: '1',
                identifier: 'test@test.com',
                password: '123456',
                isOAuthUser: true
            },
            {
                id: '2',
                identifier: 'email@test.com',
                password: '123456',
                isOAuthUser: false
            }
        ];
    })

    test('passing valid arguemts for a new user, expecting a new user to be added', async (done) => {
        const repository = mockRepository.getMockImplementation()();
        const service = new GoogleAuthenticationService(repository);

        const userId = await service.signIn('token');

        expect(users.find(u => u.id === userId))
        .toBeTruthy();

        done();
    })

    test('passing valid arguemts for a signed user, expecting a user', () => {
        users.push({
            id: '3',
            identifier: 'test@gamil.com',
            password: 'password',
            isOAuthUser: true
        });

        const repository = mockRepository.getMockImplementation()();
        const service = new GoogleAuthenticationService(repository);

        expect(service.signIn('token'))
        .resolves
        .toEqual('3');
    })

    test('passing invalid tokenId, expecting an error', () => {
        users.push({
            id: '3',
            identifier: 'test@gamil.com',
            password: 'password',
            isOAuthUser: true
        });

        const repository = mockRepository.getMockImplementation()();
        const service = new GoogleAuthenticationService(repository);

        expect(service.signIn('invalid-token'))
        .rejects
        .toThrowError();
    })

    test('passing no tokenId, expecting an error', () => {
        users.push({
            id: '3',
            identifier: 'test@gamil.com',
            password: 'password',
            isOAuthUser: true
        });

        const repository = mockRepository.getMockImplementation()();
        const service = new GoogleAuthenticationService(repository);

        expect(service.signIn(undefined))
        .rejects
        .toThrowError();
    })
})